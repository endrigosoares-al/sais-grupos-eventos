import type { Quotation } from "./types"
import { formatDateShort } from "./utils"

const BASE = "https://api.trello.com/1"
const KEY = () => process.env.TRELLO_API_KEY!
const TOKEN = () => process.env.TRELLO_TOKEN!
const LIST_ID = () => process.env.TRELLO_LIST_ORCANDO!

function auth() {
  return `key=${KEY()}&token=${TOKEN()}`
}

export async function createTrelloCard(quotation: Quotation): Promise<string | null> {
  const checkinShort = formatDateShort(quotation.checkin)
  const title = `${checkinShort} - ${quotation.nome_evento.toUpperCase()} - ${quotation.cliente.toUpperCase()}`

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + quotation.validade)

  const cardRes = await fetch(`${BASE}/cards?${auth()}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: title,
      idList: LIST_ID(),
      due: dueDate.toISOString(),
      desc: [
        `**Evento:** ${quotation.nome_evento}`,
        `**Empresa:** ${quotation.empresa}`,
        `**Tipo de Cliente:** ${quotation.tipo_cliente}`,
        `**Check-in:** ${quotation.checkin}`,
        `**Check-out:** ${quotation.checkout}`,
        `**Proposta:** ${quotation.proposal_number}`,
        `**Valor Total:** R$ ${quotation.valor_final.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
        `**Quartos:** ${quotation.rooms.filter(r => r.qty > 0).map(r => `${r.qty}x ${r.name}`).join(", ")}`,
        "",
        `*E-mail:* ${quotation.email_cliente}`,
      ].join("\n"),
    }),
  })

  if (!cardRes.ok) return null
  const card = await cardRes.json()
  const cardId: string = card.id

  // Add custom fields: Contato + Telefone
  const fields = await getCustomFields()
  const contatoField = fields.find((f: { name: string }) => f.name === "Contato")
  const telefoneField = fields.find((f: { name: string }) => f.name === "Telefone")

  await Promise.all([
    contatoField && setCustomField(cardId, contatoField.id, quotation.cliente),
    telefoneField && setCustomField(cardId, telefoneField.id, quotation.telefone_cliente),
  ])

  return cardId
}

export async function attachPDFToCard(cardId: string, pdfBuffer: Buffer, filename: string) {
  const form = new FormData()
  const blob = new Blob([pdfBuffer.buffer as ArrayBuffer], { type: "application/pdf" })
  form.append("file", blob, filename)
  form.append("name", filename)

  await fetch(`${BASE}/cards/${cardId}/attachments?${auth()}`, {
    method: "POST",
    body: form,
  })
}

async function getCustomFields() {
  const boardId = process.env.TRELLO_BOARD_ID!
  const res = await fetch(`${BASE}/boards/${boardId}/customFields?${auth()}`)
  if (!res.ok) return []
  return res.json()
}

async function setCustomField(cardId: string, fieldId: string, value: string) {
  await fetch(`${BASE}/card/${cardId}/customField/${fieldId}/item?${auth()}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: { text: value } }),
  })
}
