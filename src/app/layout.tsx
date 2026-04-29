import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sais Beach Living Hotel — Grupos & Eventos",
  description: "Solicite uma proposta para hospedagem de grupos e eventos no Sais Beach Living Hotel em Maceió.",
  icons: { icon: "/favicon.ico" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
