import { Metadata } from "next"
import { cookies } from "next/headers"
import QuotationList from "@/components/forms/QuotationList"

export const maxDuration = 10

export const metadata: Metadata = {
  title: "Orçamentos | SAIS — Interno",
}

export default async function OrcamentoPage() {
  await cookies()

  return (
    <main className="min-h-screen bg-[var(--beige)]">
      <header className="bg-[var(--ink)] text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 80 22" className="h-6 w-auto fill-[var(--gold)]" aria-label="SAIS">
            <text x="0" y="18" fontFamily="Georgia, serif" fontSize="20" fontWeight="700" letterSpacing="4">SAIS</text>
          </svg>
          <span className="text-white/30 text-xs">|</span>
          <span className="text-white/60 text-xs tracking-widest uppercase">Grupos & Eventos</span>
        </div>
        <a href="/api/auth/logout" className="text-xs text-white/40 hover:text-white/70 transition-colors">
          Sair
        </a>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <QuotationList />
      </div>
    </main>
  )
}
