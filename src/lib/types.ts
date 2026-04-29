export interface LeadFormData {
  // Responsável
  nome: string
  email: string
  telefone: string
  empresa: string
  tipo_cliente: string
  cargo?: string

  // Evento
  nome_evento: string
  tipo_evento?: string
  checkin: string
  checkout: string

  // Acomodações: código da categoria → quantidade
  quartos: Record<string, number>

  // F&B
  servicos_fb: string[]

  // Livre
  descricao_evento: string

  // Como chegou
  origem?: string
}

export interface RoomLine {
  code: string
  name: string
  qty: number
  rateDouble: number
  rateSingle?: number
  rateTriple?: number
  rateQuad?: number
  subtotal: number
}

export interface QuotationFormData {
  // Lead origin
  lead_id?: string

  // Client
  empresa: string
  tipo_cliente: string
  cliente: string
  email_cliente: string
  telefone_cliente: string

  // Event
  nome_evento: string
  checkin: string
  checkout: string

  // Rooms
  rooms: RoomLine[]

  // Financials
  subtotal_bruto: number
  desconto_percentual: number
  valor_final: number

  // Composition text (free-form for PDF)
  composicao_hospedagem: string

  // Conditions
  garantias: string
  validade: number
  observacoes?: string

  // Optional benefit
  codigo_promocional?: string
}

export interface Lead {
  id: string
  created_at: string
  nome: string
  email: string
  telefone: string
  empresa: string
  tipo_cliente: string
  cargo?: string
  nome_evento: string
  tipo_evento?: string
  checkin: string
  checkout: string
  quartos: Record<string, number>
  servicos_fb: string[]
  descricao_evento: string
  status: "novo" | "em_contato" | "orcando" | "fechado" | "perdido"
}

export interface Quotation {
  id: string
  proposal_number: string
  lead_id?: string
  created_at: string
  data_envio?: string
  empresa: string
  tipo_cliente: string
  cliente: string
  email_cliente: string
  telefone_cliente: string
  nome_evento: string
  checkin: string
  checkout: string
  rooms: RoomLine[]
  subtotal_bruto: number
  desconto_percentual: number
  valor_final: number
  composicao_hospedagem: string
  garantias: string
  validade: number
  observacoes?: string
  codigo_promocional?: string
  pdf_url?: string
  status: "rascunho" | "enviado" | "aceito" | "recusado"
}
