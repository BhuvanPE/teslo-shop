'use client'

import { useCartStore } from '@/store'
import { currencyFormat } from '@/utils'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export const ProductsInCart = () => {
    const productsInCart = useCartStore(state => state.cart)
    const [loaded, setLoaded] = useState(false)
    
    useEffect(() => {
        setLoaded(true)
    }, [])

    if (!loaded)
        return <p>...Loading</p>
    return (
        <div>

            {
                productsInCart.map(product => (
                    <div key={`${product.slug}-${product.size}`} className="flex mb-5">
                        <Image
                            src={`/products/${product.image}`}
                            width={100}
                            height={100}
                            alt={product.title}
                            className="mr-5 rounded"
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                            priority />
                        <div>
                            <span>
                                <p>{product.size} - {product.title} ({product.quantity})</p>
                            </span>
                            <p className='font-fold'>{currencyFormat(product.price * product.quantity)}</p>
                        </div>
                    </div>
                ))
            }

        </div>
    )
}
