import CheckoutPage from "@/components/Checkout"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@/lib/data/customer"
import PaymentWrapper from "@/modules/checkout/components/payment-wrapper"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import CheckoutSummary from "@/components/Checkout/CheckoutSummary"

export const metadata: Metadata = {
  title: "Checkout",
}

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
       <div className="small:grid-cols-[1fr_416px] content-container gap-x-40">
      {/* <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} /> */}
            {/* <Breadcrumb title={"Checkout"} pages={["checkout"]} /> */}
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
           
      <PaymentWrapper cart={cart}>
        <CheckoutPage cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart}/>
       </div>
            </>
            </div>
            </section>
            </div>
  )
}
