"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import QuotationForm from "./QuotationForm"
import type { Lead, Quotation } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export default function QuotationList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [editQuotation, setEditQuotation] = useState<Quotation | null>(null)
  const [view, setView] = useState<"leads" | "quotations" | "form">("leads")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [leadsRes, quotationsRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/orcamento"),
      ])
      const leadsData = await leadsRes.json()
      const quotationsData = await quotationsRes.json()
      setLeads(leadsData.leads || [])
      setQuotations(quotationsData.quotations || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const openNewForm = (lead: Lead) => {
    setSelectedLead(lead)
    setEditQuotation(null)
    setView("form")
  }

  const openEditForm = (q: Quotation) => {
    setEditQuotation(q)
    setSelectedLead(null)
    setView("form")
  }

  const onFormDone = () => {
    setView("quotations")
    fetchData()
  }

  if (view === "form") {
    return (
      <QuotationForm
        lead={selectedLead}
        quotation={editQuotation}
        onDone={onFormDone}
        onBack={() => setView(selectedLead ? "leads" : "quotations")}
      />
    )
  }

  const statusColors: Record<string, string> = {
    novo: "bg-blue-100 text-blue-700",
    em_contato: "bg-yellow-100 text-yellow-700",
    orcando: "bg-orange-100 text-orange-700",
    fechado: "bg-green-100 text-green-700",
    perdido: "bg-red-100 text-red-700",
    rascunho: "bg-gray-100 text-gray-600",
    enviado: "bg-[var(--beige)] text-[var(--brown)]",
    aceito: "bg-green-100 text-green-700",
    recusado: "bg-red-100 text-red-700",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-[var(--ink)]">Central de Orçamentos</h1>
          <p className="text-sm text-[var(--ink-light)] mt-1">Gerencie leads e propostas de grupos</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === "leads" ? "default" : "outline"} size="sm" onClick={() => setView("leads")}>
            Leads ({leads.length})
          </Button>
          <Button variant={view === "quotations" ? "default" : "outline"} size="sm" onClick={() => setView("quotations")}>
            Orçamentos ({quotations.length})
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[var(--ink-light)]">Carregando...</div>
      ) : view === "leads" ? (
        <div className="space-y-3">
          {leads.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[var(--border)] text-[var(--ink-light)] text-sm">
              Nenhum lead recebido ainda.
            </div>
          ) : leads.map((lead) => (
            <div key={lead.id} className="bg-white border border-[var(--border)] p-5 flex items-start justify-between gap-4 hover:border-[var(--gold)]/40 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-medium text-[var(--ink)]">{lead.nome_evento}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--ink-light)] mt-1">{lead.empresa} · {lead.nome}</p>
                <p className="text-xs text-[var(--ink-light)] mt-1">
                  {lead.checkin} → {lead.checkout} ·{" "}
                  {Object.values(lead.quartos).reduce((s, q) => s + q, 0)} quartos
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-[var(--ink-light)] mb-3">{formatDate(lead.created_at)}</p>
                <Button size="sm" onClick={() => openNewForm(lead)}>
                  Criar Orçamento
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {quotations.length === 0 ? (
            <div className="text-center py-16 bg-white border border-[var(--border)] text-[var(--ink-light)] text-sm">
              Nenhum orçamento gerado ainda.
            </div>
          ) : quotations.map((q) => (
            <div key={q.id} className="bg-white border border-[var(--border)] p-5 flex items-start justify-between gap-4 hover:border-[var(--gold)]/40 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-mono text-[var(--gold)]">{q.proposal_number}</span>
                  <h3 className="font-medium text-[var(--ink)]">{q.nome_evento}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[q.status]}`}>
                    {q.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--ink-light)] mt-1">{q.empresa} · {q.cliente}</p>
                <p className="text-xs text-[var(--ink-light)] mt-1">
                  {q.checkin} → {q.checkout} · R$ {q.valor_final.toLocaleString("pt-BR")}
                </p>
              </div>
              <div className="text-right flex-shrink-0 flex flex-col gap-2">
                <p className="text-xs text-[var(--ink-light)]">{formatDate(q.created_at)}</p>
                <Button size="sm" variant="outline" onClick={() => openEditForm(q)}>
                  Editar
                </Button>
                {q.pdf_url && (
                  <a href={q.pdf_url} target="_blank" rel="noreferrer">
                    <Button size="sm" variant="ghost">PDF</Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
