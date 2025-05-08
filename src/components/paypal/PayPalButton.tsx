'use client'

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from '@paypal/paypal-js'
import React from 'react'
import { setTransactionId } from '@/actions/payments/set-trasaction-id'
import { paypalCheckPayment } from '@/actions/paypal/check-payment'

interface Props {
    orderId: string,
    amount: number,
}

export const PayPalButton = ({ orderId, amount }: Props) => {
    const [{ isPending }] = usePayPalScriptReducer()

    const rountedAmount = (Math.round(amount * 100)) / 100

    if (isPending)
        return (
            <div className='animate-pulse mb-15'>
                <div className='h-10 bg-gray-300 rounded'>
                </div>
                <div className='h-10 bg-gray-300 rounded mt-2'>
                </div>
            </div>
        )

    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    invoice_id: orderId, // evitara que un order se vuelva a pagar, usarlo al final de pruebas de dev
                    amount: {
                        currency_code: 'USD',
                        value: `${rountedAmount}`
                    }
                }
            ]
        })

        const { ok, message } = await setTransactionId(orderId, transactionId)
        if (!ok) {
            throw new Error(message ?? 'No se pudo actualizar la orden')
        }

        //console.log(trasactionId)
        return transactionId
    }

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        const details = await actions.order?.capture()
        if (!details || !details.id) return;

        //console.log('onApprove')
        await paypalCheckPayment(details.id)
    }

    return (
        <div className='relative z-0'>
            <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
            />
        </div>
    )
}
