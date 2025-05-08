'use server'

import { auth } from "@/auth"
import { Address, Size } from "@/interfaces"
import prisma from "@/lib/prisma"

interface ProductToOrder {
    productId: string,
    quantity: number,
    size: Size,
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
    const session = await auth()
    const userId = session?.user.id

    if (!userId) {
        return {
            ok: false,
            message: 'No hay sesión de usuario'
        }
    }

    //console.log({ productIds, address, userId })

    // obtener información de los productos
    // podemos llevar más de un producto productos con el mismo ID

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    })

    // Calcular los montos:

    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)

    // Totales

    const { subTotal, tax, total } = productIds.reduce((totals, item) => {
        const productQuantity = item.quantity
        const product = products.find(product => product.id === item.productId)

        if (!product) throw new Error(`${item.productId} no existe - 500`)

        const subTotal = product.price * productQuantity

        totals.subTotal += subTotal
        totals.tax += subTotal * 0.15
        totals.total += subTotal * 1.15

        return totals
    }, { subTotal: 0, tax: 0, total: 0 })

    //console.log({ subTotal, tax, total })

    // Crear transacción

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {
            // 1. actualizar el stock

            const updatedProductPromises = products.map((product) => {
                const productQuantity = productIds.filter(p => p.productId === product.id).reduce((acc, item) => item.quantity + acc, 0)
                if (productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definido`)
                }

                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        inStock: {
                            decrement: productQuantity
                        },
                    }
                })
            })

            const updatedProducts = await Promise.all(updatedProductPromises)

            // verificamos valores negativos - no hay stock

            updatedProducts.forEach(product => {
                if (product.inStock < 0)
                    throw new Error(`${product.title} no tiene inventario suficiente`)
            })

            // 2. Crear la orden encabezado detalle

            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,
                    OrderItem: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })

            // 3. Crear la dirección

            const { country, ...restAddress } = address
            //console.log({ restAddress })
            const orderAddress = await tx.orderAddress.create({
                data: {
                    //...restAddress, por alguna razón se colaba el userId

                    address: restAddress.address,
                    address2: restAddress.address2,
                    firstName: restAddress.firstName,
                    lastName: restAddress.lastName,
                    phone: restAddress.phone,
                    postalCode: restAddress.postalCode,
                    city: restAddress.city,

                    countryId: country,
                    orderId: order.id,
                }
            })

            return {
                order: order,
                orderAddress: orderAddress,
                updatedProducts: updatedProducts,
            }
        })

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx,
        }
    } catch (error: any) {
        return {
            ok: false,
            message: error?.message,
        }
    }
}