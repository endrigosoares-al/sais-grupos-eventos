"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push("/interno/orcamento")
      } else {
        setError("Senha incorreta.")
      }
    } catch {
      setError("Erro de conexão.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--ink)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <svg viewBox="0 0 120 30" className="h-8 w-auto fill-[var(--gold)] mx-auto mb-2" aria-label="SAIS">
            <text x="0" y="26" fontFamily="Georgia, serif" fontSize="28" fontWeight="700" letterSpacing="5">SAIS</text>
          </svg>
          <p className="text-xs tracking-[0.3em] text-[var(--gold)]/60 uppercase">Área Interna</p>
        </div>
        <form onSubmit={submit} className="bg-white/5 border border-white/10 p-8">
          <p className="text-white/70 text-sm mb-6 text-center">
            Acesso exclusivo para a equipe de Grupos &amp; Eventos
          </p>
          <div className="mb-5">
            <label className="text-xs uppercase tracking-widest text-white/50 block mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 bg-white/10 border border-white/20 text-white px-4 text-sm outline-none focus:border-[var(--gold)] transition-colors"
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <p className="text-center text-xs text-white/20 mt-6">
          Sais Beach Living Hotel · grupos.eventos@saishotel.com.br
        </p>
      </div>
    </main>
  )
}
