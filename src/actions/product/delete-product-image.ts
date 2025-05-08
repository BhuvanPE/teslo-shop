'use server'

import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';

cloudinary.config({
    cloud_name: 'durzyx4bp',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
    if (!imageUrl.startsWith('http')) {
        return {
            ok: false,
            message: 'No se puede eliminar del file system'
        }
    }

    const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '' // para obtener el último y quitar el punto
    console.log(imageName)

    try {
        await cloudinary.uploader.destroy(imageName)
        const deleteImage = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            select: {
                product: {
                    select: {
                        slug: true
                    }
                }
            }
        })

        revalidatePath('/admin/products')
        revalidatePath(`/admin/products/${deleteImage.product.slug}`)
        revalidatePath(`/product/${deleteImage.product.slug}`)

        return {
            ok: true,
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo eliminar las imagenes'
        }
    }
}