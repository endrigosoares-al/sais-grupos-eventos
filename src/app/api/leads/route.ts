import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"
import { sendLeadNotification } from "@/lib/email"
import { createRDLead } from "@/lib/rdstation"
import type { LeadFormData } from "@/lib/types"

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin()
  const { data, error } = await supabaseAdmin
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ leads: data })
}

export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin()
  const body: LeadFormData = await req.json()

  // Validate required fields
  if (!body.nome || !body.email || !body.empresa || !body.checkin || !body.checkout) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
  }

  // Save to Supabase
  const { data: lead, error } = await supabaseAdmin
    .from("leads")
    .insert({
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      empresa: body.empresa,
      tipo_cliente: body.tipo_cliente,
      cargo: body.cargo || null,
      nome_evento: body.nome_evento,
      tipo_evento: body.tipo_evento || null,
      checkin: body.checkin,
      checkout: body.checkout,
      quartos: body.quartos,
      servicos_fb: body.servicos_fb,
      descricao_evento: body.descricao_evento || "",
      origem: body.origem || null,
      status: "novo",
    })
    .select()
    .single()

  if (error || !lead) {
    return NextResponse.json({ error: "Erro ao salvar lead" }, { status: 500 })
  }

  // Fire-and-forget: email + RD Station (don't block response)
  Promise.all([
    sendLeadNotification({ ...body, id: lead.id }).catch(console.error),
    createRDLead({ ...body, id: lead.id }).catch(console.error),
  ])

  return NextResponse.json({ ok: true, id: lead.id })
}
