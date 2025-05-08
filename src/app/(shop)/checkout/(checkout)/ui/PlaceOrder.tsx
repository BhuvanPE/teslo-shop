'use client'

import { placeOrder } from '@/actions/orders/place-order'
import { useAddressStore, useCartStore } from '@/store'
import { currencyFormat } from '@/utils'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export const PlaceOrder = () => {
    const router = useRouter()

    const [loaded, setLoaded] = useState(false) // para evitar la discrepancia entre lo que tenemos en el cliente y loque tenemos en el servidor
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const address = useAddressStore(state => state.address)
    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSummayInformation())

    const cart = useCartStore(state => state.cart)
    const clearCart = useCartStore(state => state.clearCart)

    useEffect(() => {
        setLoaded(true)
    }, [])

    if (!loaded)
        return (<p>Cargando..</p>)

    const onPlaceOrder = async () => {
        setIsPlacingOrder(true)
        //await sleep(2)

        const productToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size,
        }))

        //console.log({ address, productToOrder })

        const resp = await placeOrder(productToOrder, address)
        //console.log({ resp })
        if (!resp.ok) {
            setIsPlacingOrder(false)
            setErrorMessage(resp.message)
            return
        }

        clearCart()
        router.replace('/orders/' + resp.order?.id)
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2 font-bold">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">{itemsInCart === 1 ? '1 artículo' : `${itemsInCart} artículos`}</span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="mt-5 text-2xl">Total</span>
                <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
                <p className="mb-2">
                    {/* Disclaimer */}
                    <span className="text-xs">
                        Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">políticas privacidad</a>
                    </span>
                </p>

                {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
                <button
                    onClick={onPlaceOrder}
                    className={clsx({
                        'btn-primary': !isPlacingOrder,
                        'btn-disabled': isPlacingOrder,
                    })}>
                    Colocar orden
                </button>
            </div>
        </div>
    )
}
