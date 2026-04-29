import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { signToken, COOKIE_NAME } from "@/lib/auth"
import { getSupabaseAdmin } from "@/lib/supabase"

export async function POST(req: Request) {
  const supabaseAdmin = getSupabaseAdmin()
  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: "Senha obrigatória" }, { status: 400 })
  }

  const { data: user } = await supabaseAdmin
    .from("internal_users")
    .select("id, password_hash")
    .single()

  // First-time: if no user exists, accept initial password "sais" and create user
  if (!user) {
    if (password !== "sais") {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
    }
    const hash = await bcrypt.hash("sais", 12)
    await supabaseAdmin.from("internal_users").insert({
      email: "grupos.eventos@saishotel.com.br",
      password_hash: hash,
    })
    const token = await signToken({ role: "executive" })
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    })
    return res
  }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 })
  }

  const token = await signToken({ role: "executive", userId: user.id })
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  })
  return res
}
