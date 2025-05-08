'use client'

import { ProductImage, QuantitySelector } from '@/components'
import { useCartStore } from '@/store'
//import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export const ProductsInCart = () => {
    const productsInCart = useCartStore(state => state.cart)
    const [loaded, setLoaded] = useState(false)
    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const removeProduct = useCartStore(state => state.removeProduct);

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
                        <ProductImage
                            //src={`/products/${product.image}`}
                            src={product.image}
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
                            <Link
                                className='hover:underline cursor-pointer'
                                href={`/product/${product.slug}`}>
                                <p>{product.size} - {product.title}</p>
                            </Link>
                            <p>${product.price}</p>

                            <QuantitySelector
                                quantity={product.quantity}
                                onQuantityChanged={value => updateProductQuantity(product, value)} />

                            <button className="underline" onClick={() => removeProduct(product)}>Remover</button>
                        </div>
                    </div>
                ))
            }

        </div>
    )
}
