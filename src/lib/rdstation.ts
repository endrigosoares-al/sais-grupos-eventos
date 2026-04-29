import type { LeadFormData, Quotation } from "./types"

const TOKEN = () => process.env.RD_TOKEN!
const BASE_MARKETING = "https://api.rdstation.com/1.3"

// ── Marketing: registrar conversão / criar lead ────────────
export async function createRDLead(lead: LeadFormData & { id: string }) {
  const totalRooms = Object.values(lead.quartos).reduce((s, q) => s + q, 0)

  const body = {
    identificador: "lead_grupos",
    email: lead.email,
    nome: lead.nome,
    empresa: lead.empresa,
    cargo: lead.cargo || "",
    telefone: lead.telefone,
    cf_tipo_cliente: lead.tipo_cliente,
    cf_nome_evento: lead.nome_evento,
    cf_tipo_evento: lead.tipo_evento || "",
    cf_checkin: lead.checkin,
    cf_checkout: lead.checkout,
    cf_quartos_total: String(totalRooms),
    cf_servicos_fb: lead.servicos_fb.join(", "),
    cf_descricao_evento: lead.descricao_evento || "",
    cf_origem: lead.origem || "",
    cf_lead_id: lead.id,
    tags: ["lead_grupos", "sais-hotel"],
  }

  const res = await fetch(`${BASE_MARKETING}/leads?auth_token=${TOKEN()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    console.error("RD Station lead error:", await res.text())
  }
}

// ── Marketing: atualizar lead ao gerar orçamento ───────────
export async function updateRDLeadStatus(email: string, proposalNumber: string) {
  const body = {
    identificador: "orcamento_gerado",
    email,
    cf_proposta_numero: proposalNumber,
    tags: ["orcamento-enviado"],
  }

  await fetch(`${BASE_MARKETING}/leads?auth_token=${TOKEN()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(console.error)
}

// ── CRM: criar negócio (deal) ─────────────────────────────
// RD Station CRM usa token separado — implementar quando disponível
export async function createRDDeal(quotation: Quotation): Promise<string | null> {
  // Se o token CRM não estiver configurado, ignora silenciosamente
  if (!process.env.RD_CRM_TOKEN) return null

  const res = await fetch("https://crm.rdstation.com/api/v1/deals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: process.env.RD_CRM_TOKEN,
    },
    body: JSON.stringify({
      deal: {
        name: `${quotation.nome_evento} — ${quotation.empresa}`,
        win: false,
        amount_montly: quotation.valor_final,
        cf_proposta: quotation.proposal_number,
        cf_checkin: quotation.checkin,
        cf_checkout: quotation.checkout,
      },
    }),
  })

  if (!res.ok) {
    console.error("RD CRM deal error:", await res.text())
    return null
  }

  const data = await res.json()
  return data._id || null
}

export async function attachPDFToDeal(dealId: string, pdfBuffer: Buffer, filename: string) {
  if (!process.env.RD_CRM_TOKEN) return

  const form = new FormData()
  const blob = new Blob([pdfBuffer.buffer as ArrayBuffer], { type: "application/pdf" })
  form.append("file", blob, filename)

  await fetch(`https://crm.rdstation.com/api/v1/deals/${dealId}/attachments`, {
    method: "POST",
    headers: { token: process.env.RD_CRM_TOKEN },
    body: form,
  }).catch(console.error)
}
