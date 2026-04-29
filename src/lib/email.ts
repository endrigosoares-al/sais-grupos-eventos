import { Resend } from "resend"
import { HOTEL } from "./constants"
import type { LeadFormData, Quotation } from "./types"

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

// Use verified domain in production; fallback to Resend test domain during development
const FROM = process.env.EMAIL_FROM || `${HOTEL.name} <onboarding@resend.dev>`

export async function sendLeadNotification(lead: LeadFormData & { id: string }) {
  const totalRooms = Object.values(lead.quartos).reduce((s, q) => s + q, 0)

  await getResend().emails.send({
    from: FROM,
    to: HOTEL.emailGroups,
    subject: `[NOVO LEAD] ${lead.nome_evento} — ${lead.empresa}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1A1A1A">
        <div style="background:#1A1A1A;padding:24px 32px">
          <p style="color:#C1A15C;font-size:22px;font-weight:bold;letter-spacing:6px;margin:0">SAIS</p>
          <p style="color:#C1A15C;font-size:10px;letter-spacing:4px;margin:4px 0 0">BEACH LIVING HOTEL</p>
        </div>
        <div style="padding:32px;background:#F9F8F2;border-left:4px solid #C1A15C">
          <h2 style="margin:0 0 4px;font-size:18px;font-weight:400">Novo Lead de Grupos</h2>
          <p style="margin:0;color:#6B6B6B;font-size:13px">${lead.nome_evento} — ${lead.empresa}</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <tr><td style="padding:6px 0;color:#6B6B6B;width:140px">Contato</td><td style="padding:6px 0;font-weight:bold">${lead.nome}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B">E-mail</td><td style="padding:6px 0"><a href="mailto:${lead.email}" style="color:#C1A15C">${lead.email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B">Telefone</td><td style="padding:6px 0">${lead.telefone}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B">Empresa</td><td style="padding:6px 0">${lead.empresa}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B">Tipo</td><td style="padding:6px 0">${lead.tipo_cliente}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B">Check-in</td><td style="padding:6px 0">${lead.checkin}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B">Check-out</td><td style="padding:6px 0">${lead.checkout}</td></tr>
            <tr><td style="padding:6px 0;color:#6B6B6B">Quartos</td><td style="padding:6px 0">${totalRooms} acomodações</td></tr>
          </table>
          ${lead.descricao_evento ? `
          <div style="margin-top:20px;padding:16px;background:#E9E5C3;border-radius:4px">
            <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#6B6B6B">Descrição do Evento</p>
            <p style="margin:0;font-size:13px">${lead.descricao_evento}</p>
          </div>` : ""}
          <div style="margin-top:28px">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/interno/orcamento?lead=${lead.id}"
               style="background:#C1A15C;color:#fff;text-decoration:none;padding:12px 28px;font-size:13px;display:inline-block">
              Criar Orçamento →
            </a>
          </div>
        </div>
        <div style="padding:20px 32px;background:#1A1A1A;font-size:11px;color:#666;text-align:center">
          ${HOTEL.phone} · ${HOTEL.website} · ${HOTEL.emailGroups}
        </div>
      </div>
    `,
  })
}

export async function sendQuotationToClient(quotation: Quotation, pdfBuffer: Buffer) {
  await getResend().emails.send({
    from: FROM,
    to: quotation.email_cliente,
    replyTo: HOTEL.emailGroups,
    subject: `Proposta ${quotation.proposal_number} — ${quotation.nome_evento} | Sais Beach Living Hotel`,
    attachments: [
      {
        filename: `Proposta-${quotation.proposal_number}-SAIS.pdf`,
        content: pdfBuffer,
      },
    ],
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1A1A1A">
        <div style="background:#1A1A1A;padding:24px 32px">
          <p style="color:#C1A15C;font-size:22px;font-weight:bold;letter-spacing:6px;margin:0">SAIS</p>
          <p style="color:#C1A15C;font-size:10px;letter-spacing:4px;margin:4px 0 0">BEACH LIVING HOTEL</p>
        </div>
        <div style="padding:32px">
          <p style="margin:0 0 16px">Prezado(a) <strong>${quotation.cliente}</strong>,</p>
          <p style="color:#6B6B6B;line-height:1.7;margin:0 0 16px">
            É com grande prazer que apresentamos nossa proposta de hospedagem para o
            <strong>${quotation.nome_evento}</strong>. Segue em anexo o documento completo com
            todas as condições comerciais e políticas do grupo.
          </p>
          <div style="background:#F9F8F2;border-left:4px solid #C1A15C;padding:16px 20px;margin:24px 0">
            <p style="margin:0 0 4px;font-size:11px;color:#6B6B6B;text-transform:uppercase;letter-spacing:2px">Resumo</p>
            <p style="margin:0;font-size:13px">Check-in: <strong>${quotation.checkin}</strong> · Check-out: <strong>${quotation.checkout}</strong></p>
            <p style="margin:4px 0 0;font-size:13px">Valor total: <strong style="color:#C1A15C">R$ ${quotation.valor_final.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</strong></p>
          </div>
          <p style="color:#6B6B6B;font-size:13px;line-height:1.7">
            Esta proposta é válida por <strong>${quotation.validade} dias</strong>.
            Para confirmar o bloqueio ou solicitar ajustes, entre em contato conosco.
          </p>
          <div style="margin-top:28px;padding-top:24px;border-top:1px solid #E2DDC8">
            <p style="margin:0;font-size:13px;font-weight:bold">Bruna Barbosa</p>
            <p style="margin:2px 0 0;font-size:12px;color:#6B6B6B">Analista de Grupos e Eventos</p>
            <p style="margin:2px 0 0;font-size:12px;color:#C1A15C">Sais Beach Living Hotel</p>
            <p style="margin:8px 0 0;font-size:12px;color:#6B6B6B">${HOTEL.phone} · <a href="mailto:${HOTEL.emailGroups}" style="color:#C1A15C">${HOTEL.emailGroups}</a></p>
          </div>
        </div>
        <div style="padding:20px 32px;background:#1A1A1A;font-size:11px;color:#666;text-align:center">
          ${HOTEL.address}
        </div>
      </div>
    `,
  })
}
