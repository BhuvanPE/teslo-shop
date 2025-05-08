export const revalidate = 604800;

import { ProductMobileSlideShow, ProductSlideShow, StockLabel } from "@/components";
import { titleFont } from "@/config/fonts";
import { Metadata, ResolvingMetadata } from "next";
//import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";
import { AddToCart } from "./iu/AddToCart";
import { getProductBySlug } from "@/actions/product/get-product-by-slug";

interface Props {
    params: {
        slug: string,
    }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const { slug } = params

    // fetch data
    const product = await getProductBySlug(slug)

    // optionally access and extend (rather than replace) parent metadata
    //const previousImages = (await parent).openGraph?.images || []

    return {
        metadataBase: new URL('https://tu-dominio.com'),
        title: product?.title ?? 'Producto no encontrado',
        description: product?.description ?? '',
        openGraph: {
            title: product?.title ?? 'Producto no encontrado',
            description: product?.description ?? '',
            images: [`/products/${product?.images[1]}`],
        },
    }
}

export default async function ProductPage({ params }: Props) {
    const { slug } = params
    //const product = initialData.products.find(p => p.slug === slug)
    const product = await getProductBySlug(slug)
    if (!product)
        notFound()

    return (
        <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Slideshow */}
            <div className="col-span-1 md:col-span-2">
                {/* Mobile Slideshow */}
                <ProductMobileSlideShow title={product.title} images={product.images} className="block md:hidden" />

                {/* Desktop Slideshow */}
                <ProductSlideShow title={product.title} images={product.images} className="hidden md:block" />
            </div>

            {/* Detalles */}
            <div className="col-span-1 px-5">
                <StockLabel slug={product.slug} />

                <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
                    {product.title}
                </h1>
                <p className="text-lg mb-5">${product.price}</p>

                <AddToCart product={product} />

                {/* Descripción */}
                <h3 className="font-bold text-sm">Descripción</h3>
                <p className="font-light">{product.description}</p>
            </div>
        </div>
    );
}