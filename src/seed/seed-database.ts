import { initialData } from "./seed";
import prisma from '../lib/prisma'
import { countries } from "./seed-countries";

async function main() {
    //console.log(initialData)

    // 1. Borrar registros previos
    // await Promise.all([
    //     await prisma.productImage.deleteMany(),
    //     await prisma.product.deleteMany(),
    //     await prisma.category.deleteMany(),
    // ])

    await prisma.orderAddress.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()

    await prisma.userAddress.deleteMany()
    await prisma.user.deleteMany()

    await prisma.productImage.deleteMany()
    await prisma.product.deleteMany()

    await prisma.category.deleteMany()
    await prisma.country.deleteMany()

    const { users, categories, products } = initialData

    // 2. Insertar categorías
    const categoriesData = categories.map(category => ({ name: category }))
    await prisma.category.createMany({
        data: categoriesData
    })

    // 3. Obtenemos un mapeo de ID de categoría con nombre en seed
    const categoriesDB = await prisma.category.findMany()
    const categoriesMap = categoriesDB.reduce((map, category) => {
        map[category.name.toLowerCase()] = category.id
        return map
    }, {} as Record<string, string>) // shrit, categoryID

    // Insertar productos
    //const { images, type, ...product1 } = products[0]
    products.forEach(async (product) => {
        const { images, type, ...resto } = product
        const productDB = await prisma.product.create({
            data: {
                ...resto,
                categoryId: categoriesMap[type]
            }
        })

        // Insertar imagenes
        const imagesData = images.map(image => ({
            url: image,
            productId: productDB.id
        }))
        await prisma.productImage.createMany({
            data: imagesData
        })
    })

    // Insertamos usuarios

    await prisma.user.createMany({ data: users });

    // Insertamos países

    await prisma.country.createMany({ data: countries })

    console.log('Seed Ejecutado!')
}

(() => {
    if (process.env.NODE_ENV === 'production') return
    main()
})();