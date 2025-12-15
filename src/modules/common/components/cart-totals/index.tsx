"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  return (
    <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
      <h3 className="font-medium text-xl text-dark mb-6">Cart Totals</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-dark">
          <span className="text-dark-5">Subtotal (excl. shipping and taxes)</span>
          <span 
            className="font-medium" 
            data-testid="cart-subtotal" 
            data-value={item_subtotal || 0}
          >
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-dark">
          <span className="text-dark-5">Shipping</span>
          <span 
            className="font-medium" 
            data-testid="cart-shipping" 
            data-value={shipping_subtotal || 0}
          >
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        
        {!!discount_subtotal && (
          <div className="flex items-center justify-between text-dark">
            <span className="text-dark-5">Discount</span>
            <span
              className="font-medium text-green-600"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-dark">
          <span className="text-dark-5">Taxes</span>
          <span 
            className="font-medium" 
            data-testid="cart-taxes" 
            data-value={tax_total || 0}
          >
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>
      
      <div className="h-px w-full bg-gray-3 my-6" />
      
      <div className="flex items-center justify-between">
        <span className="font-medium text-lg text-dark">Total</span>
        <span
          className="font-bold text-2xl text-dark"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
      
      <div className="h-px w-full bg-gray-3 mt-6" />
    </div>
  )
}

export default CartTotals