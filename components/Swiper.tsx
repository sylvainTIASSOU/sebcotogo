"use client"
import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide, SwiperSlideProps } from 'swiper/react';
import { isMobile } from 'mobile-device-detect';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

//import './styles.css';

// import required modules
import { Autoplay, Pagination, Navigation, FreeMode } from 'swiper/modules';
import CardArt1 from "@/components/CardArt1";
import { ArticleModel } from '@/models/ArticleModel';
import MobileDetect from 'mobile-detect';
import { Skeleton } from './ui/skeleton';
import { Empty } from 'antd';
import {Api} from "@/app/api/Api";
import { Carousel } from 'antd';

export default function Swipers() {
    const [articleData, setArticleData] = useState<ArticleModel[]>([])
    const [image, setImage] = useState<any[]>([]);
    const [data, setData] = useState<ArticleModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const md = new MobileDetect(window.navigator.userAgent);

        setIsMobile(!!md.mobile());

        setLoading(true);
        //declaration of thee variable who detecte the screen
        const fetchData = async () => {
            Api.read('/api/article').then((articles: ArticleModel[]) => {
                setData(articles);
            })

        }
        fetchData();
        setLoading(false);



    }, [isMobile])

    return (
        <>

            <Swiper
                slidesPerView={isMobile ? 1 : 2}
                spaceBetween={5}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,

                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper flex items-center justify-center space-x-5"
            >
                {
                    loading ?
                [1,2,3,4,5].map((items) =>{
                    return <SwiperSlide className={" relative left-[13%] md:left-[35%] md:right-[30%] flex self-center"} key={items}>
                        <Skeleton className={" relative left-[13%] md:left-[35%] md:right-[30%] flex self-center"} />
                    </SwiperSlide>
                })

                    :

                    data.length == 0 ?
                    <Empty className={" relative left-[13%] md:left-[35%] md:right-[30%] flex self-center"} />

                    :
                    
                    data.map((articles, index) => {
                        if (index >= 4 ) {

                            return <SwiperSlide className={" relative left-[13%] md:left-[35%] md:right-[30%] flex self-center"} key={index}>

                                <CardArt1 name={articles.name} price={String(articles.price)} description={articles.description} image={articles.imageUrl[0]} id={Number(articles.id)} />

                            </SwiperSlide>
                        }
                    })
                }




            </Swiper>


        </>
    );
}
