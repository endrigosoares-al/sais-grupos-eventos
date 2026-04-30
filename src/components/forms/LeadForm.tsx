"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ROOMS, FB_SERVICES, CLIENT_TYPES } from "@/lib/constants"
import { diffInNights } from "@/lib/utils"
import type { LeadFormData } from "@/lib/types"

const STEPS = ["Seu Evento", "Acomodações", "Serviços", "Finalizar"] as const

const ORIGEM_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "qrcode", label: "QR Code / Indicação" },
  { value: "google", label: "Pesquisa no Google" },
  { value: "indicacao", label: "Indicação de terceiro" },
  { value: "outro", label: "Outro" },
]

const TIPO_EVENTO_OPTIONS = [
  { value: "congresso", label: "Congresso / Conferência" },
  { value: "seminario", label: "Seminário / Workshop" },
  { value: "convencao", label: "Convenção Corporativa" },
  { value: "incentivo", label: "Viagem de Incentivo" },
  { value: "social", label: "Evento Social (formatura, casamento...)" },
  { value: "esportivo", label: "Evento Esportivo" },
  { value: "outro", label: "Outro" },
]

const emptyForm: LeadFormData = {
  nome: "", email: "", telefone: "", empresa: "",
  tipo_cliente: "", cargo: "", nome_evento: "", tipo_evento: "",
  checkin: "", checkout: "",
  quartos: {}, servicos_fb: [], descricao_evento: "", origem: "",
}

export default function LeadForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<LeadFormData>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const set = (field: keyof LeadFormData, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const setRoomQty = (code: string, qty: number) => {
    setForm((f) => ({
      ...f,
      quartos: { ...f.quartos, [code]: qty > 0 ? qty : 0 },
    }))
  }

  const toggleFb = (id: string) => {
    setForm((f) => ({
      ...f,
      servicos_fb: f.servicos_fb.includes(id)
        ? f.servicos_fb.filter((s) => s !== id)
        : [...f.servicos_fb, id],
    }))
  }

  const validateStep = () => {
    const errs: typeof errors = {}
    if (step === 0) {
      if (!form.nome) errs.nome = "Nome obrigatório"
      if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "E-mail inválido"
      if (!form.telefone) errs.telefone = "Telefone obrigatório"
      if (!form.empresa) errs.empresa = "Empresa obrigatória"
      if (!form.tipo_cliente) errs.tipo_cliente = "Selecione o tipo"
      if (!form.nome_evento) errs.nome_evento = "Nome do evento obrigatório"
      if (!form.checkin) errs.checkin = "Data de chegada obrigatória"
      if (!form.checkout) errs.checkout = "Data de saída obrigatória"
      if (form.checkin && form.checkout && form.checkout <= form.checkin)
        errs.checkout = "Check-out deve ser após o check-in"
    }
    if (step === 1) {
      const total = Object.values(form.quartos).reduce((s, q) => s + q, 0)
      if (total === 0) errs.quartos = "Selecione ao menos 1 quarto"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => { if (validateStep()) setStep((s) => s + 1) }
  const back = () => setStep((s) => s - 1)

  const submit = async () => {
    if (!validateStep()) return
    setLoading(true)
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Erro ao enviar")
      setSubmitted(true)
    } catch {
      alert("Erro ao enviar. Tente novamente ou entre em contato por WhatsApp.")
    } finally {
      setLoading(false)
    }
  }

  const nights = form.checkin && form.checkout ? diffInNights(form.checkin, form.checkout) : 0
  const totalRooms = Object.values(form.quartos).reduce((s, q) => s + q, 0)

  if (submitted) {
    return (
      <div className="bg-white border border-[var(--border)] p-12 text-center">
        <div className="w-16 h-16 bg-[var(--beige)] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-[var(--gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-light text-[var(--ink)] mb-3">Solicitação recebida!</h3>
        <p className="text-[var(--ink-light)] max-w-md mx-auto text-sm leading-relaxed">
          Obrigado, <strong>{form.nome.split(" ")[0]}</strong>. Nossa executiva de grupos entrará em contato em até <strong>24 horas</strong> com uma proposta personalizada para o <strong>{form.nome_evento}</strong>.
        </p>
        <div className="mt-8 pt-8 border-t border-[var(--border)] flex justify-center gap-6 text-xs text-[var(--ink-light)]">
          <span>📞 (82) 3512-1005</span>
          <span>📧 grupos.eventos@saishotel.com.br</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[var(--border)] shadow-sm">
      {/* Step indicator */}
      <div className="border-b border-[var(--border)] px-8 py-5 flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                i < step ? "bg-[var(--gold)] text-white" :
                i === step ? "bg-[var(--ink)] text-white" :
                "bg-[var(--beige)] text-[var(--ink-light)]"
              }`}>
                {i < step ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`hidden sm:block text-xs font-medium ${i === step ? "text-[var(--ink)]" : "text-[var(--ink-light)]"}`}>
                {s}
              </span>
            </div>
            {i < (STEPS.length - 1) && (
              <div className={`flex-1 mx-3 h-px transition-colors ${i < step ? "bg-[var(--gold)]" : "bg-[var(--border)]"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="p-8">
        {/* Step 0: Event + Contact */}
        {step === 0 && (
          <div className="space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-5">Seus dados</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="Nome completo *" value={form.nome} onChange={(e) => set("nome", e.target.value)} error={errors.nome} placeholder="João da Silva" />
                <Input label="E-mail *" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} placeholder="joao@empresa.com.br" />
                <Input label="Telefone / WhatsApp *" value={form.telefone} onChange={(e) => set("telefone", e.target.value)} error={errors.telefone} placeholder="(82) 99999-9999" />
                <Input label="Cargo" value={form.cargo} onChange={(e) => set("cargo", e.target.value)} placeholder="Coordenador de Eventos" />
              </div>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-5">Sua organização</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="Empresa / Entidade *" value={form.empresa} onChange={(e) => set("empresa", e.target.value)} error={errors.empresa} placeholder="Nome da empresa ou associação" />
                <Select
                  label="Tipo de cliente *"
                  value={form.tipo_cliente}
                  onChange={(e) => set("tipo_cliente", e.target.value)}
                  error={errors.tipo_cliente}
                  options={CLIENT_TYPES.map((c) => ({ value: c, label: c }))}
                  placeholder="Selecione..."
                />
              </div>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-5">Seu evento</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Input label="Nome do evento *" value={form.nome_evento} onChange={(e) => set("nome_evento", e.target.value)} error={errors.nome_evento} placeholder="Ex: IX Congresso Nacional de Medicina" />
                </div>
                <Select
                  label="Tipo de evento"
                  value={form.tipo_evento || ""}
                  onChange={(e) => set("tipo_evento", e.target.value)}
                  options={TIPO_EVENTO_OPTIONS}
                  placeholder="Selecione..."
                />
                <Select
                  label="Como nos encontrou?"
                  value={form.origem || ""}
                  onChange={(e) => set("origem", e.target.value)}
                  options={ORIGEM_OPTIONS}
                  placeholder="Selecione..."
                />
                <div>
                  <Input label="Check-in *" type="date" value={form.checkin} onChange={(e) => set("checkin", e.target.value)} error={errors.checkin} min={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <Input label="Check-out *" type="date" value={form.checkout} onChange={(e) => set("checkout", e.target.value)} error={errors.checkout} min={form.checkin || new Date().toISOString().split("T")[0]} />
                </div>
              </div>
              {nights > 0 && (
                <p className="mt-3 text-xs text-[var(--green)]">✦ {nights} {nights === 1 ? "noite" : "noites"} de hospedagem</p>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Rooms */}
        {step === 1 && (
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-2">Acomodações</h3>
            <p className="text-sm text-[var(--ink-light)] mb-6">Informe a quantidade desejada por categoria. Pode combinar tipos conforme a necessidade do grupo.</p>
            {errors.quartos && <p className="text-xs text-red-500 mb-4">{errors.quartos}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ROOMS.map((room) => {
                const qty = form.quartos[room.code] || 0
                return (
                  <div key={room.code} className={`border transition-colors p-4 ${qty > 0 ? "border-[var(--gold)] bg-[var(--beige)]/30" : "border-[var(--border)]"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--ink)] leading-tight">{room.name}</p>
                        <p className="text-xs text-[var(--ink-light)] mt-0.5">{room.description}</p>
                        <p className="text-xs text-[var(--green)] mt-1">Até {room.maxPax} {(room.maxPax as number) === 1 ? "pessoa" : "pessoas"} · {room.size}m²</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setRoomQty(room.code, qty - 1)}
                          disabled={qty === 0}
                          className="w-8 h-8 border border-[var(--border)] flex items-center justify-center text-lg text-[var(--ink-light)] hover:border-[var(--gold)] hover:text-[var(--gold)] disabled:opacity-30 transition-colors"
                        >−</button>
                        <span className="w-8 text-center text-sm font-medium text-[var(--ink)]">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setRoomQty(room.code, qty + 1)}
                          className="w-8 h-8 border border-[var(--border)] flex items-center justify-center text-lg text-[var(--ink-light)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                        >+</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {totalRooms > 0 && (
              <div className="mt-6 p-4 bg-[var(--beige)] border border-[var(--gold)]/30 text-sm">
                <span className="font-medium text-[var(--ink)]">{totalRooms} {totalRooms === 1 ? "quarto" : "quartos"} selecionados</span>
                {nights > 0 && <span className="text-[var(--ink-light)] ml-2">· {totalRooms * nights} diárias no total</span>}
              </div>
            )}
          </div>
        )}

        {/* Step 2: F&B services */}
        {step === 2 && (
          <div>
            <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-2">Serviços de Alimentação</h3>
            <p className="text-sm text-[var(--ink-light)] mb-6">Selecione os serviços de F&B desejados para o seu grupo. O café da manhã já está incluso na hospedagem.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FB_SERVICES.map((svc) => {
                const checked = form.servicos_fb.includes(svc.id)
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => toggleFb(svc.id)}
                    className={`border p-4 text-left transition-all ${checked ? "border-[var(--gold)] bg-[var(--beige)]/40" : "border-[var(--border)] hover:border-[var(--gold)]/50"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "bg-[var(--gold)] border-[var(--gold)]" : "border-[var(--border)]"}`}>
                        {checked && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--ink)]">{svc.label}</p>
                        <p className="text-xs text-[var(--ink-light)] mt-0.5">{svc.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 3: Final details */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-[var(--gold)] mb-5">Conte-nos mais sobre seu evento</h3>
              <Textarea
                label="Descreva seu evento"
                value={form.descricao_evento}
                onChange={(e) => set("descricao_evento", e.target.value)}
                placeholder="Exemplo: evento corporativo de premiação para 180 colaboradores, necessitamos de espaço para montagem de palco, coffee breaks nos intervalos, jantar de gala na última noite..."
                className="min-h-[150px]"
              />
            </div>
            {/* Summary */}
            <div className="bg-[var(--beige)] border border-[var(--gold)]/20 p-6">
              <p className="text-xs uppercase tracking-widest text-[var(--gold)] mb-4">Resumo da solicitação</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div><span className="text-[var(--ink-light)]">Evento:</span> <span className="font-medium text-[var(--ink)] ml-1">{form.nome_evento}</span></div>
                <div><span className="text-[var(--ink-light)]">Empresa:</span> <span className="font-medium text-[var(--ink)] ml-1">{form.empresa}</span></div>
                <div><span className="text-[var(--ink-light)]">Check-in:</span> <span className="font-medium text-[var(--ink)] ml-1">{form.checkin}</span></div>
                <div><span className="text-[var(--ink-light)]">Check-out:</span> <span className="font-medium text-[var(--ink)] ml-1">{form.checkout}</span></div>
                <div><span className="text-[var(--ink-light)]">Quartos:</span> <span className="font-medium text-[var(--ink)] ml-1">{totalRooms} ({nights} noites)</span></div>
                <div><span className="text-[var(--ink-light)]">Serviços F&B:</span> <span className="font-medium text-[var(--ink)] ml-1">{form.servicos_fb.length} selecionados</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between pt-6 border-t border-[var(--border)]">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            ← Voltar
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>Próximo →</Button>
          ) : (
            <Button onClick={submit} disabled={loading} className="min-w-[180px]">
              {loading ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
