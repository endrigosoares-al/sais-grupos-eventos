import { NextResponse } from "next/server"
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer"
import { createElement, type JSXElementConstructor, type ReactElement } from "react"
import { getSupabaseAdmin } from "@/lib/supabase"
import { sendQuotationToClient } from "@/lib/email"
import { createRDDeal, attachPDFToDeal, updateRDLeadStatus } from "@/lib/rdstation"
import { createTrelloCard, attachPDFToCard } from "@/lib/trello"
import QuotationPDF from "@/components/pdf/QuotationPDF"
import { generateProposalId } from "@/lib/utils"
import type { QuotationFormData, Quotation } from "@/lib/types"
import { getSession } from "@/lib/auth"

export async function GET() {
  const supabaseAdmin = getSupabaseAdmin()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from("quotations")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ quotations: data })
}

export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin()
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body: QuotationFormData & { sendEmail: boolean; proposal_number: string } = await req.json()
  const proposalNumber = body.proposal_number || generateProposalId()

  // 1. Save quotation to Supabase
  const { data: quotation, error } = await supabaseAdmin
    .from("quotations")
    .insert({
      proposal_number: proposalNumber,
      lead_id: body.lead_id || null,
      empresa: body.empresa,
      tipo_cliente: body.tipo_cliente,
      cliente: body.cliente,
      email_cliente: body.email_cliente,
      telefone_cliente: body.telefone_cliente,
      nome_evento: body.nome_evento,
      checkin: body.checkin,
      checkout: body.checkout,
      rooms: body.rooms,
      subtotal_bruto: body.subtotal_bruto,
      desconto_percentual: body.desconto_percentual,
      valor_final: body.valor_final,
      composicao_hospedagem: body.composicao_hospedagem || "",
      garantias: body.garantias || "",
      validade: body.validade,
      observacoes: body.observacoes || null,
      codigo_promocional: body.codigo_promocional || null,
      status: body.sendEmail ? "enviado" : "rascunho",
      data_envio: body.sendEmail ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error || !quotation) {
    return NextResponse.json({ error: "Erro ao salvar orçamento" }, { status: 500 })
  }

  if (!body.sendEmail) {
    return NextResponse.json({ ok: true, id: quotation.id })
  }

  // 2. Generate PDF
  const pdfBuffer = await renderToBuffer(
    createElement(QuotationPDF, { quotation: quotation as Quotation }) as ReactElement<DocumentProps, string | JSXElementConstructor<unknown>>
  )
  const filename = `Proposta-${proposalNumber}-SAIS.pdf`

  // 3. Upload PDF to Supabase Storage
  const { data: fileData } = await supabaseAdmin.storage
    .from("quotations")
    .upload(`pdfs/${quotation.id}/${filename}`, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    })

  const pdfUrl = fileData?.path
    ? supabaseAdmin.storage.from("quotations").getPublicUrl(`pdfs/${quotation.id}/${filename}`).data.publicUrl
    : null

  if (pdfUrl) {
    await supabaseAdmin.from("quotations").update({ pdf_url: pdfUrl }).eq("id", quotation.id)
    quotation.pdf_url = pdfUrl
  }

  // 4-6. Email + RD Station + Trello (in parallel, failures don't abort)
  const [, dealId, trelloCardId] = await Promise.allSettled([
    sendQuotationToClient(quotation as Quotation, pdfBuffer),
    Promise.all([
      updateRDLeadStatus(quotation.email_cliente, quotation.proposal_number),
      createRDDeal(quotation as Quotation).then(async (id) => {
        if (id) await attachPDFToDeal(id, pdfBuffer, filename)
        return id
      }),
    ]).then(([, id]) => id),
    createTrelloCard(quotation as Quotation).then(async (id) => {
      if (id) await attachPDFToCard(id, pdfBuffer, filename)
      return id
    }),
  ])

  // Update IDs in DB
  const updates: Record<string, string | null> = {}
  if (dealId.status === "fulfilled" && dealId.value) updates.rd_deal_id = dealId.value
  if (trelloCardId.status === "fulfilled" && trelloCardId.value) updates.trello_card_id = trelloCardId.value
  if (Object.keys(updates).length > 0) {
    await supabaseAdmin.from("quotations").update(updates).eq("id", quotation.id)
  }

  // Update lead status
  if (body.lead_id) {
    await supabaseAdmin.from("leads").update({ status: "orcando" }).eq("id", body.lead_id)
  }

  return NextResponse.json({ ok: true, id: quotation.id, pdf_url: pdfUrl })
}
