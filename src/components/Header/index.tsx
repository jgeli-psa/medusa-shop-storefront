import { retrieveCart } from "@lib/data/cart"
import AppHeader from "./Header"
import { getCustomer } from "@lib/data/customer"

export default async function Header() {
  const cart = await retrieveCart().catch(() => null)
    const customer = await getCustomer().catch(() => null)

  return <AppHeader cart={cart} customer={customer}/>
}
