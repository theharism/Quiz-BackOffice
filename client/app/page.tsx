import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to admin login page
  redirect("/admin")

  // This won't be rendered due to the redirect
  return null
}

