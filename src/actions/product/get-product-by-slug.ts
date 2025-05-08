import prisma from "@/lib/prisma"

export const getProductBySlug = async (slug: string) => {
    try {
        const product = await prisma.product.findFirst({
            include: {
                ProductImage: true
                // ProductImage: {
                //     select: {
                //         url: true,
                //         id: true,
                //     }
                // }
            },
            where: {
                slug: slug
            }
        })

        if (!product) return null;

        // const { ProductImage, ...resto } = product
        // return {
        //     ...resto,
        //     images: ProductImage.map(image => image.url)
        // }

        return {
            ...product,
            images: product.ProductImage.map(image => image.url)
        }
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener productor por slug')
    }
}