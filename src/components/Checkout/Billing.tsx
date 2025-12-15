"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { useToggleState } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState, useState, useEffect } from "react"
import BillingAddress from "./billing_address"
import ErrorMessage from "./error-message"
import ShippingAddress from "./shipping-address"
import { SubmitButton } from "./submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: any | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"
  const [dropdown, setDropdown] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const isCompleted = cart?.shipping_address && cart?.billing_address && cart?.email
  const isReturningCustomer = !!customer
  const hasNoAddress = (!cart?.shipping_address?.first_name && !cart?.shipping_address?.last_name)
  
  
  
  
  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )




  useEffect(() => {
      
        
  
  }, [])
  

  // Auto-collapse when no address and no customer
  useEffect(() => {
  
  
    if (hasNoAddress && !isReturningCustomer && !isOpen) {
        // setDropdown(true)
      // setIsEditing(true)
      handleEdit()
    } else if (isOpen) {
      setDropdown(true)
      setIsEditing(true)
    } else if (isCompleted) {
      setDropdown(true)
      setIsEditing(false)
      handleRedirects()
      
      
    } else if (hasNoAddress && isReturningCustomer) {
      setDropdown(true)
    }
  }, [hasNoAddress, isReturningCustomer, isOpen, isCompleted])



  const handleEdit = () => {
    setIsEditing(true)
    setDropdown(true)
    router.push(pathname + "?step=address")
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    router.push(pathname)
  }

  const handleStartNewAddress = () => {
    setIsEditing(true)
    setDropdown(true)
  }
  
  
  const handleRedirects = () => {
    
      const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const addressComplete =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 
    
    const paymentComplete = (cart.payment_collection || paidByGiftcard);
    
    if(paymentComplete){
          router.push(pathname + "?step=" + 'review')
    } else if(cart.shipping_methods.length > 0){
          router.push(pathname + "?step=" + 'payment')
    } else if(cart.shipping_address){
          router.push(pathname + "?step=" + 'delivery')
    } else {
          router.push(pathname + "?step=address")
    }
  }
  

  

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-white shadow-1 rounded-[10px]">
      {/* Collapsible Header */}
      <div
        onClick={() => {
          if (!isEditing) {
            setDropdown(!dropdown)
          }
        }}
        className={`flex items-center justify-between py-5 px-5.5 ${
          dropdown && "border-b border-gray-3"
        } ${isEditing ? "" : "cursor-pointer"}`}
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-dark text-lg">
            Address Information
          </span>
          {isCompleted && !isEditing && (
            <span className="flex items-center gap-1 text-green-600 text-sm bg-green-50 px-2.5 py-1 rounded-full">
              <CheckCircleSolid className="w-4 h-4" />
              <span>Completed</span>
            </span>
          )}
          {!isReturningCustomer && !isCompleted && !isEditing && (
            <span className="text-sm text-dark-5">
              or{" "}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  router.push("/account")
                }}
                className="text-blue hover:text-blue-dark font-medium underline"
              >
                click here to login
              </button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!dropdown && cart?.shipping_address && !isEditing && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleEdit()
              }}
              className="text-blue hover:text-blue-dark text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue/5"
            >
              Edit
            </button>
          )}
          {(!hasNoAddress && isEditing) && (
            <button
              onClick={handleCancelEdit}
              className="text-dark-5 hover:text-dark text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-2"
            >
              Cancel
            </button>
          )}
          {!isEditing && (
            <svg
              className={`${
                dropdown ? "rotate-180" : ""
              } fill-current ease-out duration-200 text-dark-4`}
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Collapsible Content */}
      <div
        className={`${
          dropdown ? "block" : "hidden"
        } pt-7.5 pb-8.5 px-4 sm:px-8.5`}
      >
        {hasNoAddress && !isReturningCustomer && !isEditing ? (
          // Empty state for guest users with no address
          <div className="text-center py-8">
            <div className="text-dark-5 mb-4">
              No address information provided yet.
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/account")}
                className="py-2.5 px-6 rounded-md font-medium transition-all duration-200 bg-blue text-white hover:bg-blue-dark"
              >
                Login to Continue
              </button>
              <button
                onClick={handleStartNewAddress}
                className="py-2.5 px-6 rounded-md font-medium transition-all duration-200 bg-gray-1 border border-gray-3 text-dark hover:bg-gray-2"
              >
                Enter Address as Guest
              </button>
            </div>
          </div>
        ) : (isEditing || !isCompleted) ? (
          // Edit form or new address form
          <>
            {isReturningCustomer && customer.addresses?.length > 0 && !isEditing ? (
              <div className="mb-6">
                <p className="text-dark mb-4">
                  Hi {customer.first_name}, do you want to use one of your saved addresses?
                </p>
                <div className="text-sm text-dark-5 mb-6">
                  <button
                    onClick={() => {
                      // Logic to show saved addresses
                    }}
                    className="text-blue hover:text-blue-dark font-medium"
                  >
                    Choose from saved addresses
                  </button>
                  {" or "}
                  <button
                    onClick={handleStartNewAddress}
                    className="text-blue hover:text-blue-dark font-medium"
                  >
                    enter new address
                  </button>
                </div>
              </div>
            ) : !isReturningCustomer && !isEditing ? (
              <div className="mb-6 p-4 bg-gray-1 rounded-lg border border-gray-3">
                <p className="text-dark mb-2">
                  Returning customer?
                </p>
                <p className="text-sm text-dark-5 mb-3">
                  Login to access your saved addresses and faster checkout.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => router.push("/account")}
                    className="py-2 px-4 rounded-md font-medium transition-all duration-200 bg-blue text-white hover:bg-blue-dark text-sm"
                  >
                    Click here to login
                  </button>
                  <div className="flex items-center gap-2 text-sm text-dark-5">
                    <span className="hidden sm:inline">or</span>
                    <button
                      onClick={handleStartNewAddress}
                      className="text-blue hover:text-blue-dark font-medium"
                    >
                      enter new address
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {(isEditing || (hasNoAddress && isReturningCustomer)) && (
              <form action={formAction}>
                <ShippingAddress
                  customer={customer}
                  checked={sameAsBilling}
                  onChange={toggleSameAsBilling}
                  cart={cart}
                />

                {!sameAsBilling && (
                  <div className="mt-8 pt-8 border-t border-gray-3">
                    <h3 className="font-medium text-dark text-lg mb-6">
                      Billing Address
                    </h3>
                    <BillingAddress cart={cart} />
                  </div>
                )}

                <div className="mt-8 pt-8 border-t border-gray-3 flex gap-3">
                  <SubmitButton 
                    data-testid="submit-address-button"
                    className="w-full sm:w-auto" 

                  >
                    {hasNoAddress ? "Save Address & Continue" : "Save Changes"}
                  </SubmitButton>
                  {!hasNoAddress && <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="py-3 px-8 rounded-lg font-medium transition-all duration-200 bg-gray-1 border border-gray-3 text-dark hover:bg-gray-2"
                  >
                    Cancel
                  </button>}
                </div>
                <ErrorMessage 
                  error={message} 
                  data-testid="address-error-message" 
                  className="mt-4"
                />
              </form>
            )}
          </>
        ) : (
          // Completed address summary view
          <div className="pt-2">
            {cart && cart.shipping_address ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-1 p-5 rounded-lg">
                  <h3 className="font-medium text-dark text-lg mb-4">
                    Shipping Address
                  </h3>
                  <div className="space-y-2 text-dark-5">
                    <p className="font-medium">
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </p>
                    <p>{cart.shipping_address.address_1}</p>
                    {cart.shipping_address.address_2 && (
                      <p>{cart.shipping_address.address_2}</p>
                    )}
                    <p>
                      {cart.shipping_address.city}, {cart.shipping_address.postal_code}
                    </p>
                    <p className="font-medium">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </p>
                    {cart.shipping_address.phone && (
                      <p className="mt-3">📞 {cart.shipping_address.phone}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-1 p-5 rounded-lg">
                  <h3 className="font-medium text-dark text-lg mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-dark-5">
                    <p className="font-medium">Email</p>
                    <p>{cart.email}</p>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-dark mb-3">
                        Billing Address
                      </h4>
                      {sameAsBilling ? (
                        <p className="text-dark-5">
                          Same as shipping address
                        </p>
                      ) : (
                        <div className="space-y-2">
                          <p className="font-medium">
                            {cart.billing_address?.first_name}{" "}
                            {cart.billing_address?.last_name}
                          </p>
                          <p>{cart.billing_address?.address_1}</p>
                          <p>
                            {cart.billing_address?.city},{" "}
                            {cart.billing_address?.postal_code}
                          </p>
                          <p className="font-medium">
                            {cart.billing_address?.country_code?.toUpperCase()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            
            <div className="mt-8 pt-8 border-t border-gray-3">
              <button
                onClick={handleEdit}
                className="text-blue hover:text-blue-dark font-medium py-2 px-4 rounded-md hover:bg-blue/5"
              >
                Edit Address Information
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Addresses