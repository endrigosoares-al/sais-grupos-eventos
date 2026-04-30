import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "sais-beach-living-secret-change-in-production"
)

const PROTECTED = ["/interno/orcamento"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = request.cookies.get("sais_internal_session")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/interno/login", request.url))
  }

  try {
    await jwtVerify(token, SECRET)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL("/interno/login", request.url))
  }
}

export const config = {
  matcher: ["/interno/orcamento", "/interno/orcamento/:path*"],
}
