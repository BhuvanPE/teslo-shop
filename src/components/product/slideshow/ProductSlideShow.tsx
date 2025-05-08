'use client'

import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperObject } from 'swiper'
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';
//import Image from 'next/image';
import { ProductImage } from '../product-image/ProductImage';

interface Props {
    images: string[],
    title: string,
    className?: string,
}

export const ProductSlideShow = ({ images, title, className }: Props) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

    return (
        <div className={`${className}`}>
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                } as React.CSSProperties}
                spaceBetween={10}
                navigation={true}
                autoplay={{
                    delay: 2500
                }
                }
                thumbs={{
                    swiper: thumbsSwiper,
                    //swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                }}
                modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                className="mySwiper2"
            >
                {
                    images.map(img => (
                        <SwiperSlide key={img}>
                            <ProductImage
                                width={1024}
                                height={800}
                                alt={title}
                                src={img}
                                //src={`/products/${img}`}
                                className='rounded-lg object-fill'
                            />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
            >
                {
                    images.map(img => (
                        <SwiperSlide key={img}>
                            <ProductImage
                                width={300}
                                height={300}
                                alt={title}
                                //src={`/products/${img}`}
                                src={img}
                                className='rounded-lg object-fill'
                            />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}
