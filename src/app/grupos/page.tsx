import { Metadata } from "next"
import Image from "next/image"
import LeadForm from "@/components/forms/LeadForm"

const A = "/sais-assets/assets/"

export const metadata: Metadata = {
  title: "Grupos & Eventos | Sais Beach Living Hotel",
  description:
    "Solicite uma proposta para hospedagem de grupos e eventos no Sais Beach Living Hotel em Maceió. Piscinas naturais, rooftop e gastronomia autoral.",
}

export default function GruposPage() {
  return (
    <main className="min-h-screen bg-[var(--beige)] text-[var(--ink)]">
      <section className="relative min-h-[92vh] overflow-hidden bg-[var(--ink)] text-white">
        <Image
          src={`${A}piscina_20do_20rooftop_20com_2_349cf5706f77.jpg`}
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.76),rgba(0,0,0,.36)_48%,rgba(0,0,0,.18)),linear-gradient(0deg,rgba(0,0,0,.5),rgba(0,0,0,0)_45%)]" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-between px-6 py-8 md:px-10 md:py-10">
          <header className="flex items-center justify-between gap-5 border-b border-white/20 pb-5">
            <Image
              src={`${A}0f2d1c_630e44e64702423c83ec255_3972680c0367.png`}
              alt="Sais Beach Living Hotel"
              width={320}
              height={112}
              className="h-12 w-auto object-contain md:h-16"
            />
            <a
              href="https://wa.me/5582996130280"
              className="hidden border border-white/55 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-[var(--gold)] hover:bg-[var(--gold)] sm:inline-flex"
            >
              Fale com eventos
            </a>
          </header>

          <div className="grid items-end gap-10 py-14 md:grid-cols-[1fr_340px] md:py-20">
            <div className="max-w-3xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-[var(--gold-light)]">
                Grupos & Eventos em Maceió
              </p>
              <h1 className="font-sais-serif max-w-2xl text-5xl font-normal leading-[0.96] md:text-7xl">
                Seu evento de frente para o mar de Pajuçara.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/82 md:text-lg">
                Estrutura completa para hospedagens corporativas, eventos sociais e grupos, com rooftop, gastronomia autoral e a experiência Sais Beach Living Hotel.
              </p>
            </div>

            <aside className="border border-white/24 bg-black/24 p-6 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--gold-light)]">Contato direto</p>
              <a href="https://wa.me/5582996130280" className="mt-4 block text-2xl font-bold text-white hover:text-[var(--gold-light)]">
                (82) 99613-0280
              </a>
              <p className="mt-2 text-sm text-white/70">grupos.eventos@saishotel.com.br</p>
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/18 pt-6 text-sm text-white/74">
                <span>324 acomodações</span>
                <span>Rooftop panorâmico</span>
                <span>Flor de Sal</span>
                <span>Perto do centro</span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-5 text-sm text-[var(--ink-light)] md:grid-cols-4 md:px-10">
          {["Pajuçara", "Rooftop", "Gastronomia", "Hospedagem"].map((item) => (
            <div key={item} className="border-l border-[var(--border)] pl-4">
              <span className="text-[var(--gold)]">SAIS</span> {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-[0.95fr_1.05fr] md:px-10 md:py-24">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[var(--gold)]">Beach Living Hotel</p>
          <h2 className="font-sais-serif text-4xl font-normal leading-tight md:text-6xl">
            Um cenário elegante para receber bem.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--ink-light)] md:text-base">
            Ambientes integrados ao litoral de Alagoas, áreas sociais abertas, quartos confortáveis e uma equipe preparada para transformar a chegada do grupo em uma experiência fluida.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Image
            src={`${A}restaurante_20salao_20e_20mesa_b4d73362a26f.jpg`}
            alt=""
            width={640}
            height={800}
            className="aspect-[4/5] w-full object-cover"
          />
          <Image
            src={`${A}quarto_20402_20Frente_20Mar_20_5ed15e1ba050.jpg`}
            alt=""
            width={640}
            height={800}
            className="mt-10 aspect-[4/5] w-full object-cover"
          />
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[var(--border)] bg-[var(--beige)]">
        <Image
          src={`${A}areia_8c1b86a86044.jpg`}
          alt=""
          fill
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
        />
        <div className="relative mx-auto max-w-4xl px-6 py-16 md:px-10 md:py-20">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-[var(--gold)]">Solicitação de Proposta</p>
            <h2 className="font-sais-serif text-4xl font-normal leading-tight text-[var(--ink)] md:text-5xl">
              Conte-nos sobre seu evento
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--ink-light)]">
              Preencha o formulário abaixo e nossa executiva de grupos entrará em contato em até 24 horas.
            </p>
          </div>
          <LeadForm />
        </div>
      </section>

      <footer className="bg-[var(--ink)] px-6 py-10 text-center text-xs text-white/58">
        <Image
          src={`${A}0f2d1c_630e44e64702423c83ec255_3972680c0367.png`}
          alt="Sais Beach Living Hotel"
          width={320}
          height={112}
          className="mx-auto mb-6 h-12 w-auto object-contain opacity-90"
        />
        <p>Sais Beach Living Hotel | Av. Dr. Antônio Gouveia, 81 - Pajuçara, Maceió - AL | (82) 3512-1004</p>
      </footer>
    </main>
  )
}
