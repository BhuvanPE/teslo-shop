'use server'

import prisma from '@/lib/prisma'
import { Gender, Product, Size } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'durzyx4bp',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    description: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
    inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender)
})

export const createUpdateProduct = async (formData: FormData) => {
    //console.log(formData)
    const data = Object.fromEntries(formData) // obtenemos la data del formdata
    const productParsed = productSchema.safeParse(data)

    if (!productParsed.success) {
        console.log(productParsed.error)
        return { ok: false }
    }
    //console.log(productParsed.data)

    const product = productParsed.data
    product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim() // reemplazamos los espacios en blanco

    const { id, ...rest } = product

    try {
        const prismaTx = await prisma.$transaction(async (tx) => {
            let product: Product
            const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase())

            if (id) {
                product = await tx.product.update({
                    where: { id },
                    data: {
                        ...rest,
                        sizes: { // este campo es un set de datos
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            } else {
                product = await tx.product.create({
                    data: {
                        ...rest,
                        sizes: { // este campo es un set de datos
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
            }

            //console.log({ product })

            // proceso de carga de imagenes
            if (formData.getAll('images')) {
                //console.log(formData.getAll('images'))
                // obtener url
                const images = await uploadImages(formData.getAll('images') as File[])
                //console.log(images)
                if (!images) {
                    throw new Error('No se pudo cargar las imagenes')
                }

                await tx.productImage.createMany({
                    data: images.map(image => ({
                        url: image!,
                        productId: product.id
                    }))
                })
            }

            return {
                product
            }
        })

        revalidatePath('/admin/products')
        revalidatePath(`/admin/products/${prismaTx.product.slug}`)
        revalidatePath(`/product/${prismaTx.product.slug}`)

        return {
            ok: true,
            product: prismaTx.product
        }
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se logró guardar'
        }
    }

}

const uploadImages = async (images: File[]) => {
    try {
        const uploadPromises = images.map(async (image) => {
            try {
                const buffer = await image.arrayBuffer()
                const base64Image = Buffer.from(buffer).toString('base64')

                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`).then(resp => resp.secure_url)
            }
            catch (error) {
                console.log(error)
                return null
            }
        })

        const uploadImages = await Promise.all(uploadPromises)
        return uploadImages

    } catch (error) {
        console.log(error)
        return null
    }
}