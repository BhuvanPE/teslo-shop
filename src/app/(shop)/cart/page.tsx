//'use client'

import { Title } from "@/components";
import { initialData } from "@/seed/seed";
//import Image from "next/image";
import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { OrderSummary } from "./ui/OrderSummary";
//import { redirect } from "next/navigation";

const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
]

export default function CardPage() {
    //redirect('/empty')

    //const onQuantityChanged = (value: number) => void {}

    return (
        <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
            <div className="flex flex-col w-[1000px]">
                <Title title="carrito" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {/* Carrito */}
                    <div className="flex flex-col mt-5">
                        <span className="text-xl">Agregar más items</span>
                        <Link href='/' className="underline mb-5">
                            Continúa comprando
                        </Link>

                        {/* Items */}
                        <ProductsInCart />
                    </div>

                    {/* Checkout */}
                    {/* <div className="absolute top-10 right-10 bg-white rounded-xl shadow-xl p-7 h-[300px]"> */}
                    {/* <div className="bg-white rounded-xl shadow-xl p-7 h-[300px]"> */}
                    <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
                        <h2 className="text-2xl mb-2">Resumen de orden</h2>
                        <OrderSummary />
                        <div className="mt-5 mb-2 w-full">
                            <Link href="/checkout/address" className="flex btn-primary justify-center">
                                Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}