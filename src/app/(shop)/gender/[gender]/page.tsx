export const revalidate = 60 // 60 segundos

import { getPaginatedProductsWithImages } from "@/actions/product/product-pagination";
import { Pagination, ProductGrid, Title } from "@/components";
//import { Category } from "@/interfaces";
import { Gender } from "@prisma/client";
//import { initialData } from "@/seed/seed";
import { notFound, redirect } from "next/navigation";

//const products = initialData.products

interface Props {
    params: {
        //id: Category
        gender: string
    },
    searchParams: {
        page?: string,
    }
}

export default async function GenderPage ({ params, searchParams }: Props) {
    //const { id } = params
    //const products_cat = products.filter(p => p.gender === id)

    const { gender } = params
    const page = searchParams.page ? parseInt(searchParams.page) : 1
    const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page, gender: gender as Gender })

    if (products.length === 0) redirect(`/gender/${gender}`)

    // esto es un objeto literal
    const labels: Record<string, string> = {
        'men': 'Hombres',
        'women': 'Mujeres',
        'kid': 'Niños',
        'unisex': 'Unisex',
    }

    // if (id === 'kids')
    //     notFound();

    return (
        <>
            <Title
                title={`Artículos de ${labels[gender]}`}
                subtitle="Lista de productos"
                className="mb-2"
            >
            </Title>
            <ProductGrid products={products} />
            <Pagination totalPages={totalPages} />
        </>
    );
}