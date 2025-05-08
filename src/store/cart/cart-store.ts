import type { CartProduct } from '@/interfaces'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface State {
    cart: CartProduct[],
    getTotalItems: () => number,
    //getSummayInformation: () => void,
    getSummayInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    },
    addProductToCart: (product: CartProduct) => void,
    updateProductQuantity: (product: CartProduct, quantity: number) => void,
    removeProduct: (product: CartProduct) => void,
    clearCart: () => void
}

export const useCartStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],
            getTotalItems: () => {
                const { cart } = get()
                return cart.reduce((total, item) => total + item.quantity, 0);
            },
            getSummayInformation: () => {
                const { cart } = get()
                const subTotal = cart.reduce((monto, item) => monto + item.quantity * item.price, 0)
                const tax = subTotal * 0.15
                const total = subTotal + tax
                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);
                return {
                    subTotal, tax, total, itemsInCart
                }
            },
            addProductToCart: (product: CartProduct) => {
                const { cart } = get()
                //console.log(cart)
                // 1. revisar si el producto existe en el carrito con la talla seleccionada
                const productInCart = cart.some((item) => item.id === product.id && item.size === product.size) // si existe uno la menos que cumpla la condición
                if (!productInCart) {
                    set({ cart: [...cart, product] })
                    return;
                }
                // 2. se que el producto existe por talla
                const updateCartProduct = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size)
                        return { ...item, quantity: item.quantity + product.quantity }
                    return item
                })
                set({ cart: updateCartProduct })
            },
            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get()
                const updateCartProduct = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size)
                        return { ...item, quantity: quantity }
                    return item
                })
                set({ cart: updateCartProduct })
            },
            removeProduct: (product: CartProduct) => {
                const { cart } = get()
                const removeCartProduct = cart.filter((item) => item.id !== product.id || item.size !== product.size)
                set({ cart: removeCartProduct })
            },
            clearCart: () => {
                set({ cart: [] })
            },
        })
        , {
            name: 'shopping-cart',
        }
    )
)