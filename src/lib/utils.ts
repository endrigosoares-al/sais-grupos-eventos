import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: Date | string): string {
  // Parse manually to avoid timezone shift on date-only strings (YYYY-MM-DD)
  const str = typeof date === "string" ? date : date.toISOString().split("T")[0]
  const [year, month, day] = str.split("-")
  const months = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"]
  return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`
}

export function formatDateShort(date: Date | string): string {
  // Parse manually to avoid timezone shift on date-only strings (YYYY-MM-DD)
  const str = typeof date === "string" ? date : date.toISOString().split("T")[0]
  const [year, month, day] = str.split("-")
  return `${day}.${month}.${year.slice(-2)}`
}

export function diffInNights(checkin: string, checkout: string): number {
  const a = new Date(checkin)
  const b = new Date(checkout)
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export function generateProposalId(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const seq = Math.floor(Math.random() * 9000) + 1000
  return `GRP-${year}${month}-${seq}`
}
