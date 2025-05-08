import Image from 'next/image'
import React from 'react'

interface Props {
    src?: string,
    alt: string,
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className'],
    width: number,
    height: number,
    style?: React.StyleHTMLAttributes<HTMLImageElement>['style'],
    priority?: boolean,
}

export const ProductImage = ({ src, alt, className, width, height, style, priority }: Props) => {
    const newSrc = (src) ? src.startsWith('http') ? src : `/products/${src}` : '/imgs/placeholder.jpg'
    return (
        <Image
            src={newSrc}
            //src={product.ProductImage[0].url}
            width={width}
            height={height}
            alt={alt}
            className={className}
            style={style}
            priority={priority} />

    )
}
