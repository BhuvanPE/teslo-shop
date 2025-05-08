'use server'

import prisma from "@/lib/prisma"
import { sleep } from "@/utils"

export const getStockBySlug = async (slug: string): Promise<number> => {
    try {
        await sleep(1)

        const productDB = await prisma.product.findFirst({
            where: {
                slug: slug
            },
            select: {
                inStock: true
            }
        })

        if (!productDB) return 0;
        return productDB.inStock ?? 0
    } catch (error) {
        console.log(error)
        return 0
        //throw new Error('Error al obtener stock por slug')
    }
}