import { NextResponse } from "next/server"
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer"
import { createElement, type JSXElementConstructor, type ReactElement } from "react"
import { supabaseAdmin } from "@/lib/supabase"
import { sendQuotationToClient } from "@/lib/email"
import { createRDDeal, attachPDFToDeal } from "@/lib/rdstation"
import { createTrelloCard, attachPDFToCard } from "@/lib/trello"
import QuotationPDF from "@/components/pdf/QuotationPDF"
import type { QuotationFormData, Quotation } from "@/lib/types"
import { getSession } from "@/lib/auth"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body: QuotationFormData & { sendEmail: boolean } = await req.json()

  // Fetch existing
  const { data: existing } = await supabaseAdmin
    .from("quotations")
    .select("*")
    .eq("id", id)
    .single()

  if (!existing) return NextResponse.json({ error: "Não encontrado" }, { status: 404 })

  // Update record
  const { data: quotation, error } = await supabaseAdmin
    .from("quotations")
    .update({
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
      status: body.sendEmail ? "enviado" : existing.status,
      data_envio: body.sendEmail ? new Date().toISOString() : existing.data_envio,
    })
    .eq("id", id)
    .select()
    .single()

  if (error || !quotation) return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 })

  if (!body.sendEmail) return NextResponse.json({ ok: true })

  // Generate + send PDF
  const pdfBuffer = await renderToBuffer(
    createElement(QuotationPDF, { quotation: quotation as Quotation }) as ReactElement<DocumentProps, string | JSXElementConstructor<unknown>>
  )
  const filename = `Proposta-${quotation.proposal_number}-SAIS.pdf`

  await supabaseAdmin.storage
    .from("quotations")
    .upload(`pdfs/${id}/${filename}`, pdfBuffer, { contentType: "application/pdf", upsert: true })

  const pdfUrl = supabaseAdmin.storage.from("quotations").getPublicUrl(`pdfs/${id}/${filename}`).data.publicUrl
  await supabaseAdmin.from("quotations").update({ pdf_url: pdfUrl }).eq("id", id)

  const [, dealId, trelloCardId] = await Promise.allSettled([
    sendQuotationToClient(quotation as Quotation, pdfBuffer),
    existing.rd_deal_id
      ? attachPDFToDeal(existing.rd_deal_id, pdfBuffer, filename)
      : createRDDeal(quotation as Quotation).then(async (did) => {
          if (did) {
            await attachPDFToDeal(did, pdfBuffer, filename)
            return did
          }
        }),
    existing.trello_card_id
      ? attachPDFToCard(existing.trello_card_id, pdfBuffer, filename)
      : createTrelloCard(quotation as Quotation).then(async (cid) => {
          if (cid) {
            await attachPDFToCard(cid, pdfBuffer, filename)
            return cid
          }
        }),
  ])

  const updates: Record<string, string> = { pdf_url: pdfUrl }
  if (!existing.rd_deal_id && dealId.status === "fulfilled" && dealId.value) updates.rd_deal_id = dealId.value as string
  if (!existing.trello_card_id && trelloCardId.status === "fulfilled" && trelloCardId.value) updates.trello_card_id = trelloCardId.value as string
  await supabaseAdmin.from("quotations").update(updates).eq("id", id)

  if (body.lead_id) {
    await supabaseAdmin.from("leads").update({ status: "orcando" }).eq("id", body.lead_id)
  }

  return NextResponse.json({ ok: true, pdf_url: pdfUrl })
}
