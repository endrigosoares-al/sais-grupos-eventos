import { cookies } from "next/headers"
import LoginClient from "./LoginClient"

export const maxDuration = 5

export default async function LoginPage() {
  await cookies()
  return <LoginClient />
}
