"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ROOMS, CLIENT_TYPES } from "@/lib/constants"
import { diffInNights, formatCurrency, generateProposalId } from "@/lib/utils"
import type { Lead, Quotation, QuotationFormData, RoomLine } from "@/lib/types"

interface Props {
  lead: Lead | null
  quotation: Quotation | null
  onDone: () => void
  onBack: () => void
}

const GARANTIAS_DEFAULT = `Sinal de 50% dividido em duas parcelas:
• 25% no ato da confirmação
• 25% em até 30 dias
Saldo de 50% até 30 dias antes do check-in.`

export default function QuotationForm({ lead, quotation, onDone, onBack }: Props) {
  const [form, setForm] = useState<QuotationFormData>({
    lead_id: lead?.id || quotation?.lead_id,
    empresa: lead?.empresa || quotation?.empresa || "",
    tipo_cliente: lead?.tipo_cliente || quotation?.tipo_cliente || "",
    cliente: lead?.nome || quotation?.cliente || "",
    email_cliente: lead?.email || quotation?.email_cliente || "",
    telefone_cliente: lead?.telefone || quotation?.telefone_cliente || "",
    nome_evento: lead?.nome_evento || quotation?.nome_evento || "",
    checkin: lead?.checkin || quotation?.checkin || "",
    checkout: lead?.checkout || quotation?.checkout || "",
    rooms: quotation?.rooms || [],
    subtotal_bruto: quotation?.subtotal_bruto || 0,
    desconto_percentual: quotation?.desconto_percentual || 0,
    valor_final: quotation?.valor_final || 0,
    composicao_hospedagem: quotation?.composicao_hospedagem || "",
    garantias: quotation?.garantias || GARANTIAS_DEFAULT,
    validade: quotation?.validade || 7,
    observacoes: quotation?.observacoes || "",
    codigo_promocional: quotation?.codigo_promocional || "",
  })

  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (field: keyof QuotationFormData, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }))

  const nights = form.checkin && form.checkout ? diffInNights(form.checkin, form.checkout) : 0

  const updateRoom = (code: string, field: keyof RoomLine, value: string | number) => {
    setForm((f) => {
      const existing = f.rooms.find((r) => r.code === code)
      const room = ROOMS.find((r) => r.code === code)!
      if (!existing) {
        const newRoom: RoomLine = {
          code,
          name: room.name,
          qty: 0,
          rateDouble: 0,
          subtotal: 0,
          [field]: typeof value === "string" ? parseFloat(value) || 0 : value,
        }
        newRoom.subtotal = newRoom.qty * newRoom.rateDouble * nights
        return { ...f, rooms: [...f.rooms, newRoom] }
      }
      const updated = f.rooms.map((r) => {
        if (r.code !== code) return r
        const updated = { ...r, [field]: typeof value === "string" ? parseFloat(value) || 0 : value }
        updated.subtotal = updated.qty * updated.rateDouble * nights
        return updated
      }).filter((r) => r.qty > 0 || r.rateDouble > 0)
      return { ...f, rooms: updated }
    })
  }

  useEffect(() => {
    const subtotal = form.rooms.reduce((s, r) => s + r.subtotal, 0)
    const discount = (subtotal * form.desconto_percentual) / 100
    const final = subtotal - discount
    setForm((f) => ({ ...f, subtotal_bruto: subtotal, valor_final: final }))
  }, [form.rooms, form.desconto_percentual])

  const save = async (sendEmail: boolean) => {
    setLoading(true)
    try {
      const isNew = !quotation
      const res = await fetch(isNew ? "/api/orcamento" : `/api/orcamento/${quotation!.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sendEmail, proposal_number: quotation?.proposal_number || generateProposalId() }),
      })
      if (!res.ok) throw new Error("Erro")
      if (sendEmail) setSent(true)
      else onDone()
    } catch {
      alert("Erro ao salvar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-white border border-[var(--border)] p-16 text-center max-w-lg mx-auto mt-10">
        <div className="w-16 h-16 bg-[var(--beige)] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-light text-[var(--ink)] mb-2">Orçamento enviado!</h3>
        <p className="text-[var(--ink-light)] text-sm">PDF gerado, e-mail enviado ao cliente, lead atualizado no RD Station e card criado no Trello.</p>
        <Button className="mt-8" onClick={onDone}>Voltar para lista</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="text-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors">
          ← Voltar
        </button>
        <h2 className="text-xl font-light text-[var(--ink)]">
          {quotation ? `Editar Orçamento — ${quotation.proposal_number}` : "Novo Orçamento"}
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client data */}
          <div className="bg-white border border-[var(--border)] p-6">
            <h3 className="text-xs uppercase tracking-widest text-[var(--gold)] mb-5">Dados do Cliente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Empresa / Entidade" value={form.empresa} onChange={(e) => set("empresa", e.target.value)} />
              <Select
                label="Tipo de Cliente"
                value={form.tipo_cliente}
                onChange={(e) => set("tipo_cliente", e.target.value)}
                options={CLIENT_TYPES.map((c) => ({ value: c, label: c }))}
                placeholder="Selecione..."
              />
              <Input label="Nome do Contato" value={form.cliente} onChange={(e) => set("cliente", e.target.value)} />
              <Input label="E-mail do Cliente" type="email" value={form.email_cliente} onChange={(e) => set("email_cliente", e.target.value)} />
              <Input label="Telefone" value={form.telefone_cliente} onChange={(e) => set("telefone_cliente", e.target.value)} />
              <Input label="Nome do Evento" value={form.nome_evento} onChange={(e) => set("nome_evento", e.target.value)} />
              <Input label="Check-in" type="date" value={form.checkin} onChange={(e) => set("checkin", e.target.value)} />
              <Input label="Check-out" type="date" value={form.checkout} onChange={(e) => set("checkout", e.target.value)} />
            </div>
            {nights > 0 && <p className="text-xs text-[var(--green)] mt-3">✦ {nights} noites</p>}
          </div>

          {/* Rooms + pricing */}
          <div className="bg-white border border-[var(--border)] p-6">
            <h3 className="text-xs uppercase tracking-widest text-[var(--gold)] mb-5">Acomodações & Tarifas</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-xs text-[var(--ink-light)] uppercase tracking-wider">
                    <th className="text-left pb-3 font-medium">Categoria</th>
                    <th className="text-center pb-3 font-medium w-20">Qtd</th>
                    <th className="text-center pb-3 font-medium w-32">Diária (R$)</th>
                    <th className="text-right pb-3 font-medium w-28">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {ROOMS.map((room) => {
                    const row = form.rooms.find((r) => r.code === room.code)
                    const qty = row?.qty || 0
                    const rate = row?.rateDouble || 0
                    const sub = qty * rate * (nights || 1)
                    return (
                      <tr key={room.code} className="border-b border-[var(--border)]/50">
                        <td className="py-3">
                          <p className="font-medium text-[var(--ink)]">{room.name}</p>
                          <p className="text-xs text-[var(--ink-light)]">até {room.maxPax} pax · {room.size}m²</p>
                        </td>
                        <td className="py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={qty || ""}
                            onChange={(e) => updateRoom(room.code, "qty", parseInt(e.target.value) || 0)}
                            className="w-16 h-8 border border-[var(--border)] text-center text-sm outline-none focus:border-[var(--gold)]"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-3 text-center">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={rate || ""}
                            onChange={(e) => updateRoom(room.code, "rateDouble", e.target.value)}
                            className="w-28 h-8 border border-[var(--border)] text-center text-sm outline-none focus:border-[var(--gold)]"
                            placeholder="0,00"
                          />
                        </td>
                        <td className="py-3 text-right font-medium text-[var(--ink)]">
                          {sub > 0 ? formatCurrency(sub) : "—"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center gap-4 justify-end">
              <span className="text-sm text-[var(--ink-light)]">Desconto comercial (%)</span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={form.desconto_percentual || ""}
                onChange={(e) => set("desconto_percentual", parseFloat(e.target.value) || 0)}
                className="w-20 h-8 border border-[var(--border)] text-center text-sm outline-none focus:border-[var(--gold)]"
                placeholder="0"
              />
            </div>
          </div>

          {/* Composition text */}
          <div className="bg-white border border-[var(--border)] p-6">
            <h3 className="text-xs uppercase tracking-widest text-[var(--gold)] mb-4">Composição da Hospedagem</h3>
            <Textarea
              value={form.composicao_hospedagem}
              onChange={(e) => set("composicao_hospedagem", e.target.value)}
              placeholder="Descreva a composição das tarifas, serviços inclusos, etc. Esse texto aparece diretamente no PDF."
              className="min-h-[100px]"
            />
          </div>

          {/* Conditions */}
          <div className="bg-white border border-[var(--border)] p-6">
            <h3 className="text-xs uppercase tracking-widest text-[var(--gold)] mb-4">Garantias & Condições</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Textarea
                label="Garantias / Pagamento"
                value={form.garantias}
                onChange={(e) => set("garantias", e.target.value)}
                className="min-h-[100px]"
              />
              <div className="space-y-4">
                <Input
                  label="Validade da proposta (dias)"
                  type="number"
                  min="1"
                  value={form.validade}
                  onChange={(e) => set("validade", parseInt(e.target.value) || 7)}
                />
                <Input
                  label="Código promocional (opcional)"
                  value={form.codigo_promocional || ""}
                  onChange={(e) => set("codigo_promocional", e.target.value)}
                  placeholder="Ex: AMG10"
                />
              </div>
            </div>
          </div>

          {/* Observations */}
          <div className="bg-white border border-[var(--border)] p-6">
            <h3 className="text-xs uppercase tracking-widest text-[var(--gold)] mb-4">Observações Internas</h3>
            <Textarea
              value={form.observacoes || ""}
              onChange={(e) => set("observacoes", e.target.value)}
              placeholder="Observações que aparecerão no PDF (seção de observações)..."
              className="min-h-[80px]"
            />
          </div>
        </div>

        {/* Sidebar summary */}
        <div className="space-y-4">
          <div className="bg-[var(--ink)] text-white p-6 sticky top-6">
            <p className="text-xs uppercase tracking-widest text-[var(--gold)] mb-5">Resumo Financeiro</p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Subtotal bruto</span>
                <span>{formatCurrency(form.subtotal_bruto)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Desconto ({form.desconto_percentual}%)</span>
                <span>− {formatCurrency(form.subtotal_bruto * form.desconto_percentual / 100)}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-medium text-base">
                <span>Total Final</span>
                <span className="text-[var(--gold)]">{formatCurrency(form.valor_final)}</span>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-xs text-white/50">
              <div className="flex justify-between">
                <span>Quartos</span>
                <span>{form.rooms.reduce((s, r) => s + r.qty, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Noites</span>
                <span>{nights}</span>
              </div>
              <div className="flex justify-between">
                <span>Total diárias</span>
                <span>{form.rooms.reduce((s, r) => s + r.qty, 0) * nights}</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button
                onClick={() => save(false)}
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                disabled={loading}
              >
                Salvar rascunho
              </Button>
              <Button
                onClick={() => save(true)}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Gerando..." : "Enviar ao cliente"}
              </Button>
            </div>
            <p className="text-xs text-white/30 text-center mt-4">
              Gera PDF · Envia e-mail · Cria card no Trello · Atualiza RD Station
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
