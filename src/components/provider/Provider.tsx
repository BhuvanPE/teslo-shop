'use client'

import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

interface Props {
    children: React.ReactNode,
}

const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
    currency: "USD",
    intent: "capture",
};

export const Provider = ({ children }: Props) => {
    return (
        <PayPalScriptProvider options={initialOptions}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </PayPalScriptProvider>
    )
}