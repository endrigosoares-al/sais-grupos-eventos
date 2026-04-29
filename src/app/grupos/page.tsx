import { Metadata } from "next"
import LeadForm from "@/components/forms/LeadForm"

export const metadata: Metadata = {
  title: "Grupos & Eventos | Sais Beach Living Hotel",
  description:
    "Solicite uma proposta para hospedagem de grupos e eventos no Sais Beach Living Hotel em Maceió. Piscinas naturais, rooftop e gastronomia autoral.",
}

export default function GruposPage() {
  return (
    <main className="min-h-screen bg-[var(--beige)]">
      {/* Hero */}
      <section className="relative bg-[var(--ink)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle at 70% 50%, var(--gold) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            {/* Logo wordmark */}
            <div className="mb-8">
              <svg viewBox="0 0 160 40" className="h-10 w-auto fill-[var(--gold)]" aria-label="SAIS Beach Living Hotel">
                <text x="0" y="32" fontFamily="Georgia, serif" fontSize="36" fontWeight="700" letterSpacing="6">SAIS</text>
              </svg>
              <p className="text-xs tracking-[0.3em] text-[var(--gold)] mt-1 uppercase">Beach Living Hotel</p>
            </div>
            <h1 className="text-3xl md:text-4xl font-light leading-tight mb-4">
              Seu evento merece<br />
              <span className="font-bold text-[var(--gold)]">a vista mais bonita</span><br />
              de Maceió.
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-md">
              Em frente às piscinas naturais de Pajuçara, o Sais oferece estrutura completa para grupos e eventos com sofisticação e o melhor do litoral alagoano.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/60">
              <span>✦ 324 acomodações</span>
              <span>✦ Rooftop panorâmico</span>
              <span>✦ Restaurante Flor de Sal</span>
              <span>✦ 3 min do Centro de Convenções</span>
            </div>
          </div>
          <div className="hidden md:block w-px h-40 bg-white/10" />
          <div className="flex-shrink-0 text-center md:text-right">
            <p className="text-xs uppercase tracking-widest text-white/50 mb-2">Fale com nossa equipe</p>
            <a href="https://wa.me/5582996130280" className="text-[var(--gold)] text-lg hover:underline">
              (82) 99613-0280
            </a>
            <p className="text-xs text-white/40 mt-1">grupos.eventos@saishotel.com.br</p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] mb-3">Solicitação de Proposta</p>
          <h2 className="text-2xl md:text-3xl font-light text-[var(--ink)]">
            Conte-nos sobre seu evento
          </h2>
          <p className="text-[var(--ink-light)] mt-3 text-sm">
            Preencha o formulário abaixo e nossa executiva de grupos entrará em contato em até 24 horas.
          </p>
        </div>
        <LeadForm />
      </section>

      {/* Footer strip */}
      <footer className="bg-[var(--ink)] text-white/50 text-xs text-center py-6 px-4">
        <p>Sais Beach Living Hotel · Av. Dr. Antônio Gouveia, 81 – Pajuçara, Maceió – AL · (82) 3512-1004</p>
      </footer>
    </main>
  )
}
