export default function Home() {
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login"
  }
  return null
}
