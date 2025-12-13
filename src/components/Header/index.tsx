import { retrieveCart } from "@lib/data/cart"
import AppHeader from "./Header"

export default async function Header() {
  const cart = await retrieveCart().catch(() => null)

  return <AppHeader cart={cart} />
}
