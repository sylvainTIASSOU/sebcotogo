"use client"
import {FaSearch} from "react-icons/fa";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import Swipers from "@/components/Swiper";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import Card2 from "@/components/Card2";
import {ArticleModel} from "../../models/ArticleModel";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import EmptyData from "@/components/EmptyData";
import {Skeleton} from "@/components/ui/skeleton";
import CommentSwiper from "@/components/CommentSwiper";
import {ArrowRightCircle, Quote, User} from "lucide-react";
import {Empty} from "antd";
import {Api} from "@/app/api/Api";
import Image from "next/image";
import {BsCart} from "react-icons/bs";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"
import {ImagesSlider} from "@/components/ImagesSlider";
import { motion } from "framer-motion";

export default function Home() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ArticleModel[]>([]);
    const [actif, setActif] = useState(false);
    const [articlesData, setArticlesData] = useState<ArticleModel[]>([])
    const [data1, setData1] = useState<ArticleModel[]>([])
    const [data2, setData2] = useState<ArticleModel[]>([])
    const [data3, setData3] = useState<ArticleModel[]>([])
    const isAuth = useSelector((state: RootState) => state.auth.value.isAuth)
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);
    const [promotion, setPromotion] = useState<any[]>([]);
    const route = useRouter();




    useEffect(() => {
        setLoading(true)
        setLoading1(true)
        setLoading2(true)
        setLoading3(true)

        Api.read('/api/article').then((data) => {
            setArticlesData(data)
        }).finally(() => {
            setLoading(false);
        });
        Api.read(`/api/article/getArticleByCategoryName/acier`).then((data) => {
            setData1(data)
        }).finally(() => {
            setLoading1(false);
        });
        Api.read('/api/article/getArticleByCategoryName/ciment').then((data) => {
            setData2(data)
        }).finally(() => {
            setLoading2(false);
        });
        Api.read('/api/article/getArticleByCategoryName/materiaux').then((data) => {
            setData3(data)
        }).finally(() => {
            setLoading3(false);
        });
        Api.read('/api/promotionArticle').then((promo) => {
            setPromotion(promo);
            console.log(promo)
        })

    }, [])

    /**fonction of search */
    const handleChange = (e: any) => {
        const searchTerm = e.target.value;
        if (searchTerm.trim() !== '') {
            setActif(true)
            setQuery(searchTerm);
            // Simulation d'une recherche avec un tableau de données statique
            const filteredResults = articlesData.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filteredResults);
        } else {
            setActif(false)
            setQuery('');
            setResults([]);
        }
    };


    const images = [
        "/pexels-pixabay-159306-scaled.jpg",
        "/materiau.jpg",
        "/images/bgImg.png",
        "/casque.jpg",
        "/istockphoto-474198470-612x612.jpg",
        "/pexels-photo-1249610-1.jpeg",
        "/pexels-rezwan-1145434.jpg",
        "/pexels-yuraforrat-10161111.jpg",

    ]
    return (
        <main className="overflow-x-hidden hide-scrollbar">
            {/*   <ImagesSlider images={images} className={"h-[40rem] top-0 "}>
                <motion.div
                    initial={{
                        opacity: 0,
                        y: -80,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="z-50 flex flex-col justify-center items-center"
                >
                    <motion.p
                        className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
                        Découvrez notre site de matériaux de construction
                        offrant une variété exceptionnelle de sable et de  gravier.
                        Profitez de produits de qualité et d'un service  fiable pour réaliser vos projets.
                    </motion.p>


                    <div className={'md:hidden flex ml-[25px]'}>
                        {
                            !isAuth && <Button variant={"outline"}
                                               className={'border-buttonColor flex space-x-5 text-[20px] mt-3'}
                                               size={'lg'}
                                               onClick={() => {
                                                   route.push("/registre")
                                               }}
                            >
                                <h1>S'inscrire maintenant!</h1>
                                <ArrowRightCircle/>
                            </Button>
                        }

                    </div>


                    <div className={'md:block hidden mt-10 ml-[30px]'}>
                        <div className={'flex space-x-2 items-center bg-white h-[50px] w-[600px] rounded-[20px] px-3'}>
                            <form>
                                <input
                                    className={'md:w-[450px] h-9  my-3 ml-2 bg-white outline-0 border-0 focus:border-0 focus:outline-0 '}
                                    placeholder={'Trouver un Produit'}
                                    type="text"
                                    value={query}
                                    onChange={handleChange}

                                />
                            </form>

                            <button className={'bg-buttonColor p-2   w-[100px] my-1 rounded-[20px] flex items-center justify-center space-x-2'}>
                                <FaSearch className={'w-[15px] h-[15px] '} color={'white'}/>
                                <h1 className={'text-[18px] text-white mt-[-5px]'}>search</h1>
                            </button>
                        </div>

                        <div
                            className={`${actif ? 'block bg-white w-[600px] p-5 rounded-[20px] h-auto mt-3 absolute' : 'hidden'} `}>
                            <ul className={"flex flex-col space-y-5"}>
                                {results.map((result, index) => (
                                    <li key={index}>
                                        <Link className={"hover:text-blue-600"} href={'/product/1'}>
                                            {result.name}
                                        </Link>

                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>


                </motion.div>
            </ImagesSlider>*/}

            <div
                className={' flex flex-col space-y-10 items-center justify-center content-center px-2  md:px-20 bg-coverPageMobBg md:bg-coverPageWebBg bg-cover bg-containt bg-center   bg-fixed top-0 bg-no-repeat w-full h-[40rem]'}>
                <div
                    className={'text-white text-2xl md:text-5xl text-center font-black'}>
                    Découvrez notre site de matériaux de construction
                     offrant une variété exceptionnelle de sable et de  gravier.
                    Profitez de produits de qualité et d'un service  fiable pour réaliser vos projets.
                </div>


                <div className={'md:hidden flex ml-[25px]'}>
                    {
                        !isAuth && <Button variant={"outline"}
                                           className={'border-buttonColor flex space-x-5 text-[20px] mt-3'}
                                           size={'lg'}
                                           onClick={() => {
                                               route.push("/registre")
                                           }}
                        >
                            <h1>S'inscrire maintenant!</h1>
                            <ArrowRightCircle/>
                        </Button>
                    }

                </div>


                <div className={'md:block hidden mt-10 ml-[30px]'}>
                    <div className={'flex space-x-2 items-center bg-white h-[50px] w-[600px] rounded-[20px] px-3'}>
                        <form>
                            <input
                                className={'md:w-[450px] h-9  my-3 ml-2 bg-white outline-0 border-0 focus:border-0 focus:outline-0 '}
                                placeholder={'Trouver un Produit'}
                                type="text"
                                value={query}
                                onChange={handleChange}

                            />
                        </form>

                        <button className={'bg-buttonColor p-2   w-[100px] my-1 rounded-[20px] flex items-center justify-center space-x-2'}>
                            <FaSearch className={'w-[15px] h-[15px] '} color={'white'}/>
                            <h1 className={'text-[18px] text-white mt-[-5px]'}>search</h1>
                        </button>
                    </div>

                    <div
                        className={`${actif ? 'block bg-white w-[600px] p-5 rounded-[20px] h-auto mt-3 absolute' : 'hidden'} `}>
                        <ul className={"flex flex-col space-y-5"}>
                            {results.map((result, index) => (
                                <li key={index}>
                                    <Link className={"hover:text-blue-600"} href={'/product/1'}>
                                        {result.name}
                                    </Link>

                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

            <div className={'mt-10  flex flex-col space-y-20 '}>

                {/* Article */}
                <div className={"flex md:px-20 px-3 flex-col space-y-20"}>
                    <h1 className={'text-2xl md:text-4xl text-start md:px-0 font-medium text-black mt-5'}>
                        Explorez notre sélection de sacs de ciment, briques, <br/> blocs, graviers, sables, poutres et
                        autres <br/>
                        matériaux de construction.
                    </h1>

                    <div className={"grid grid-cols-1 md:grid-cols-4 gap-4"}>
                        {
                            loading ?
                                [1, 2, 3, 4, 5, 6].map((items) => {
                                    return (
                                        <Skeleton key={items}
                                                  className={"shadow-xl p-3 md:w-[15em] h-[18em] rounded-lg flex flex-col justify-between content-between"}/>
                                    );
                                })
                                :
                                articlesData.length == 0 ?
                                    <EmptyData/>
                                    :
                                    articlesData.map((items, index) => {
                                        if (index < 4) {
                                            return (
                                                <div key={index}
                                                     className={"shadow-xl bg-white space-y-5 p-3 md:w-[15em] rounded-lg flex flex-col justify-between content-between"}>
                                                    <Image src={items.imageUrl[0]} alt={"image"} width={150}
                                                           height={150}
                                                           className={"object-cover bg-cover bg-center self-center"}/>
                                                    <div
                                                        className={"flex justify-between content-between items-center"}>
                                                        <div>
                                                            <h1 className={"font-bold text-xl"}>{items.name}</h1>
                                                            <h1 className={"text-gray-600 "}>{items.description.slice(0, 20)}</h1>
                                                            <h1 className={"text-secondColor text-lg font-bold "}>{items.price} TTC</h1>
                                                        </div>

                                                        <Button className={"bg-secondColor hover:bg-secondColor/50"}
                                                                onClick={() => {
                                                                    route.push(`/products/${items.id}`)
                                                                }}
                                                                size={"icon"}>
                                                            <BsCart/>
                                                        </Button>

                                                    </div>

                                                </div>
                                            );
                                        }

                                    })
                        }

                    </div>
                    <div className={" w-full md:px-0"}>
                        {/*swipper*/}
                        <section className={"flex items-center content-center justify-center"}>
                            <Carousel
                                plugins={[
                                    Autoplay({
                                        delay: 2000,
                                    }),
                                ]}
                                opts={{
                                    align: "start",
                                }}
                                className="w-full  ">
                                <CarouselContent className={" w-full"}>
                                    {
                                        articlesData.map((items, index) => {
                                            return (
                                                <CarouselItem key={index} className={"md:basis-1/2 lg:basis-1/3"}>
                                                    <div className="p-1">
                                                        <Card className={"  "}>
                                                            <CardContent
                                                                className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between md:space-x-5 md:content-between   md:h-[200px] aspect-square items-center   p-4">

                                                                <Image src={items.imageUrl[0]} alt={""} width={300}
                                                                       height={300} className={'hidden md:flex'}/>
                                                                <div className={"h-[300px]  flex md:hidden"}>
                                                                    <Image src={items.imageUrl[0]} alt={""} width={500}
                                                                           height={300} className={''}/>
                                                                </div>


                                                                <div className={'w-full flex flex-col space-y-3 '}>
                                                                    {/*title*/}
                                                                    <h1 className={'font-bold text-lg text-center md:text-start'}>{items.name}</h1>

                                                                    {/*description*/}
                                                                    <div
                                                                        className={' text-center text-orange-600  md:text-start font-bold text-sm mt-5'}>
                                                                        {items.price} <span
                                                                        className={'font-light text-[15px]'}>TTC</span>
                                                                    </div>

                                                                    <Button
                                                                        onClick={() => {
                                                                            route.push(`/products/${items.id}`)
                                                                        }}
                                                                        className={"bg-sky-500 mr-3 mb-2 md:mb-0"}>
                                                                        Voire les détails.
                                                                    </Button>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                </CarouselItem>
                                            )
                                        })
                                    }
                                </CarouselContent>
                                <CarouselPrevious/>
                                <CarouselNext/>
                            </Carousel>
                        </section>

                    </div>

                    <Button variant={"outline"}
                            onClick={() => {
                                route.push("/articles/1");
                            }}
                            className={"flex space-x-3 bg-transparent border-none w-[150px]  shadow-none text-blue-600  "}>
                        <h1 className={"text-lg"}>
                            Voir plus

                        </h1>
                        <ArrowRightCircle className={"size-7"}/>
                    </Button>
                </div>

                <section className={"md:px-20 px-3 bg-buttonColor/20 p-5 grid grid-cols-1 md:grid-cols-2 items-center"}>
                    <div>
                        <h1 className={"text-2xl font-bold md:text-4xl text-blue-600 "}>
                            Nous travaillons exclusivement avec des fournisseurs de confiance pour vous
                            offrir des matériaux de construction de la plus haute qualité.
                        </h1>

                        <h2>
                            Notre équipe de service client est à votre disposition pour vous aider
                            à chaque étape de votre projet. Que vous ayez des questions sur nos produits,
                            besoin de conseils techniques, ou d'assistance pour passer votre commande,
                            nous sommes là pour vous. Nous nous engageons à répondre à toutes
                            vos demandes dans les plus brefs délais.
                        </h2>
                    </div>

                    <Image src={"/materiaux-mysweetimmo.png"} alt={""} height={700} width={700}
                           className={"bg-cover object-cover"}/>
                </section>


                {/*categori serction*/}
                <section className={'mt-[50px] md:px-20 px-3 flex flex-col space-y-5 py-10'}>
                    <h1 className={'text-[30px] font-medium text-black'}>Parcourez nos catégories</h1>

                    <Tabs defaultValue="acier" className="md:w-[400px]">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger className={"font-bold text-lg "} value="acier">Acier</TabsTrigger>
                            <TabsTrigger className={"font-bold text-lg "} value="ciment">Ciment</TabsTrigger>
                            <TabsTrigger className={"font-bold text-lg "} value="materiaux">Materiaux</TabsTrigger>
                        </TabsList>
                        <TabsContent
                            className={"md:w-[80rem] w-full xl:w-[105rem] flex space-x-0 flex-col space-y-10 md:flex-row md:space-y-0 md:space-x-5 items-center "}
                            value="acier">
                            <div className={"md:w-[600px] w-full "}>
                                <Image src={"/acier.jpg"} className={"rounded-2xl"} alt={""} width={400} height={400}
                                       quality={100} priority={true}/>

                            </div>

                            <div className={" w-full grid md:pr-[25rem] grid-cols-1 md:grid-cols-2 gap-4"}>
                                {
                                    loading1 ?
                                        [1, 2, 3].map((items) => {
                                            return (
                                                <Skeleton key={items}
                                                          className={"shadow-xl p-3 md:max-w-[25em] h-[10em]  rounded-lg flex  justify-between content-between"}/>
                                            );
                                        })
                                        :
                                        data1.length == 0 ?
                                            <EmptyData/>
                                            :
                                            data1.map((items, index) => {
                                                return (
                                                    <div key={index}
                                                         className={"shadow-xl bg-white p-3 md:max-w-[25em]  rounded-lg flex  justify-between content-between"}>
                                                        <Image src={items.imageUrl[0]} alt={"image"} width={150}
                                                               height={150}
                                                               className={"object-cover bg-cover bg-center self-center"}/>
                                                        <div className={"flex flex-col space-y-5  "}>
                                                            <div>
                                                                <h1 className={"font-bold text-xl"}>{items.name}</h1>
                                                                <h1 className={"text-gray-600 "}>{items.description.slice(0, 20)}</h1>
                                                                <h1 className={"text-secondColor text-lg font-bold "}>{items.price} TTC</h1>
                                                            </div>

                                                            <Button
                                                                className={"bg-secondColor hover:bg-secondColor/50 flex space-x-2  text-sm"}
                                                                onClick={() => {
                                                                    route.push(`/products/${items.id}`)
                                                                }}
                                                                size={"sm"}>
                                                                <BsCart/>
                                                                <h1>Ajouter Au Panier</h1>

                                                            </Button>

                                                        </div>

                                                    </div>
                                                );
                                            })
                                }
                            </div>

                        </TabsContent>


                        <TabsContent
                            className={"md:w-[80rem] xl:w-[105rem] flex space-x-0 flex-col space-y-10 md:flex-row md:space-y-0 md:space-x-5 items-center"}
                            value="ciment">
                            <div className={"md:w-[600px]"}>
                                <Image src={"/cimtogo.jpg"} className={"rounded-2xl"} alt={""} width={400} height={400}
                                       quality={100} priority={true}/>

                            </div>
                            <div className={" w-full md:pr-[25rem] grid grid-cols-1 md:grid-cols-2 gap-4"}>
                                {
                                    loading1 ?
                                        [1, 2, 3].map((items) => {
                                            return (
                                                <Skeleton key={items}
                                                          className={"shadow-xl p-3 md:max-w-[25em] h-[10em]  rounded-lg flex  justify-between content-between"}/>
                                            );
                                        })
                                        :
                                        data2.length == 0 ?
                                            <EmptyData/>
                                            :
                                            data2.map((items, index) => {
                                                return (
                                                    <div key={index}
                                                         className={"shadow-xl bg-white p-3 md:max-w-[25em]  rounded-lg flex  justify-between content-between"}>
                                                        <Image src={items.imageUrl[0]} alt={"image"} width={150}
                                                               height={150}
                                                               className={"object-cover bg-cover bg-center self-center"}/>
                                                        <div className={"flex flex-col space-y-5  "}>
                                                            <div>
                                                                <h1 className={"font-bold text-xl"}>{items.name}</h1>
                                                                <h1 className={"text-gray-600 "}>{items.description.slice(0, 20)}</h1>
                                                                <h1 className={"text-secondColor text-lg font-bold "}>{items.price} TTC</h1>
                                                            </div>

                                                            <Button
                                                                className={"bg-secondColor hover:bg-secondColor/50 flex space-x-2  text-sm"}
                                                                onClick={() => {
                                                                    route.push(`/products/${items.id}`)
                                                                }}
                                                                size={"sm"}>
                                                                <BsCart/>
                                                                <h1>Ajouter Au Panier</h1>

                                                            </Button>

                                                        </div>

                                                    </div>
                                                );
                                            })
                                }
                            </div>

                        </TabsContent>


                        <TabsContent
                            className={"md:w-[80rem] xl:w-[105rem] flex space-x-0 flex-col space-y-10 md:flex-row md:space-y-0 md:space-x-5 items-center"}
                            value="materiaux">
                            <div className={"md:w-[600px]"}>
                                <Image src={"/materiau.jpg"} className={"rounded-2xl"} alt={""} width={400} height={600}
                                       quality={100} priority={true}/>

                            </div>

                            <div className={"w-full md:pr-[25rem] grid grid-cols-1 md:grid-cols-2 gap-4"}>
                                {
                                    loading1 ?
                                        [1, 2, 3].map((items) => {
                                            return (
                                                <Skeleton key={items}
                                                          className={"shadow-xl p-3 md:max-w-[25em] h-[10em]  rounded-lg flex  justify-between content-between"}/>
                                            );
                                        })
                                        :
                                        data3.length == 0 ?
                                            <EmptyData/>
                                            :
                                            data3.map((items, index) => {
                                                return (
                                                    <div key={index}
                                                         className={"shadow-xl bg-white p-3 md:max-w-[25em]  rounded-lg flex  justify-between content-between"}>
                                                        <Image src={items.imageUrl[0]} alt={"image"} width={150}
                                                               height={150}
                                                               className={"object-cover bg-cover bg-center self-center"}/>
                                                        <div className={"flex flex-col space-y-5  "}>
                                                            <div>
                                                                <h1 className={"font-bold text-xl"}>{items.name}</h1>
                                                                <h1 className={"text-gray-600 "}>{items.description.slice(0, 20)}</h1>
                                                                <h1 className={"text-secondColor text-lg font-bold "}>{items.price} TTC</h1>
                                                            </div>

                                                            <Button
                                                                className={"bg-secondColor hover:bg-secondColor/50 flex space-x-2  text-sm"}
                                                                size={"sm"}
                                                                onClick={() => {
                                                                    route.push(`/products/${items.id}`)
                                                                }}
                                                            >
                                                                <BsCart/>
                                                                <h1>Ajouter Au Panier</h1>

                                                            </Button>

                                                        </div>

                                                    </div>
                                                );
                                            })
                                }
                            </div>

                        </TabsContent>
                    </Tabs>


                    {/*
                    data1.length == 0 && data2.length == 0 && data3.length == 0 && <Empty />

                <Tabs defaultValue={data1.length != 0 ? "acier" :  "cimant" } className="w-auto mt-10">
                    <TabsList>
                        <TabsTrigger value="cimant" className={data2.length == 0 ? "hidden" :"flex font-bold text-[18px]"}>cimant</TabsTrigger>
                        <TabsTrigger value="acier"   className={data1.length == 0 ? "hidden" :"flex font-bold text-[18px]"}>acier</TabsTrigger>
                        <TabsTrigger value="agérégat" className={data3.length == 0 ? "hidden" : "flex font-bold text-[18px]"}>agérégat</TabsTrigger>
                    </TabsList>
                    <TabsContent value="cimant" className={data2.length == 0 ? "hidden" :'md:px-10 px-3 w-full items-center justify-center flex flex-col space-y-5 md:space-y-0 md:grid grid-cols-1 md:grid-cols-5 gap-4'}>
                    {
                        loading ?
                            [1,2,3,4,5].map((items) => {
                                return (
                                    <div key={items}>
                                        <Skeleton className={"rounded-[15px] md:w-[200px] w-[300px]   h-[300px] md:h-[270px]"} />
                                    </div>

                                )
                            })

                            :
                            data2.length == 0 ?
                                <EmptyData/>
                                :
                                data2.map((articles, index) => {

                                    return <div key={index}>
                                        <Card2 articleName={articles.name} price={Number(articles.price)} id={Number(articles.id)} image={articles.imageUrl[0]} />
                                    </div>
                                })
                    }

                </TabsContent>
                    <TabsContent value="acier" className={data1.length == 0 ? "hidden" :'md:px-10 px-3 w-full items-center justify-center  flex flex-col space-y-5 md:space-y-0 md:grid grid-cols-1 md:grid-cols-5 gap-4'}>
                        {
                            loading ?
                                [1,2,3,4,5].map((items) => {
                                    return (
                                        <div key={items}>
                                            <Skeleton className={"rounded-[15px] md:w-[200px] w-[300px]   h-[300px] md:h-[270px]"} />
                                        </div>

                                    )
                                })

                                :
                            data1.length == 0 ?
                                <EmptyData/>
                                :
                            data1.map((articles, index) => {

                                return <div key={index}>
                                    <Card2 articleName={articles.name} price={Number(articles.price)} id={Number(articles.id)} image={articles.imageUrl[0]} />
                                </div>
                            })
                        } 
                    </TabsContent>
                    <TabsContent value="agérégat" className={data3.length == 0 ? "hidden" : 'md:px-10 px-3 w-full items-center justify-center flex flex-col space-y-5 md:space-y-0 md:grid grid-cols-1 md:grid-cols-5 gap-4'}>
                    {
                        loading ?
                            [1,2,3,4,5].map((items) => {
                                return (
                                    <div key={items}>
                                        <Skeleton className={"rounded-[15px] md:w-[200px] w-[300px]   h-[300px] md:h-[270px]"} />
                                    </div>

                                )
                            })

                            :
                        data3.length == 0 ?
                            <EmptyData/>
                             :
                            data3.map((articles, index) => {
                                return <div key={index}>
                                    <Card2 articleName={articles.name} price={Number(articles.price)} id={Number(articles.id)} image={articles.imageUrl[0]} />
                                </div>
                            })
                        } 
                       
                    </TabsContent>
                </Tabs>
                */}
                </section>


                {/*promotion*/}
                <section className={"flex md:px-20 px-3 flex-col space-y-5 items-center content-center justify-center"}>
                    <h1 className={"text-2xl md:text-4xl"}>Articles en promotions </h1>
                    <Carousel
                        plugins={[
                            Autoplay({
                                delay: 2000,
                            }),
                        ]}
                        opts={{
                            align: "start",
                        }}
                        className="w-full  ">
                        <CarouselContent className={" w-full"}>
                            {
                                promotion.length == 0 ?
                                    <EmptyData />
                                    :
                                    promotion.map((items, index) => {
                                    return (
                                        <CarouselItem key={index} className={"md:basis-1/3 lg:basis-1/3"}>
                                            <div className="p-1">
                                                <Card className={"w-full  "}>
                                                    <CardContent
                                                        className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:justify-between md:space-x-5 md:content-between  md:h-[200px] aspect-square items-center   p-4">

                                                        <Image src={items.product.imageUrl[0]} alt={""} width={300}
                                                               height={300} className={'hidden md:flex'}/>
                                                        <div className={"h-[300px]  flex md:hidden"}>
                                                            <Image src={items.product.imageUrl[0]} alt={""} width={500}
                                                                   height={300} className={''}/>
                                                        </div>


                                                        <div className={'w-full flex flex-col space-y-3 '}>
                                                            {/*title*/}
                                                            <h1 className={'font-bold text-lg text-center md:text-start'}>{items.product.name}</h1>

                                                            {/*description*/}
                                                            <div
                                                                className={' text-center text-orange-600 line-through  md:text-start font-bold text-sm  mt-5'}>
                                                                {items.oldPrice} <span
                                                                className={'font-light text-[15px]'}>TTC</span>
                                                            </div>
                                                            <div
                                                                className={' text-center text-orange-600  md:text-start font-bold text-lg mt-5'}>
                                                                {items.newPrice} <span
                                                                className={'font-light text-[15px]'}>TTC</span>
                                                            </div>

                                                            <Button
                                                                onClick={() => {
                                                                    route.push(`/products/${items.id}`)
                                                                }}
                                                                className={"bg-sky-500 mr-3 mb-2 md:mb-0"}>
                                                                Voire les détails.
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    )
                                })
                            }
                        </CarouselContent>
                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                </section>

                {/*info 2*/}
                <section
                    className={"w-full h-screen bg-[url(/pexels-pixabay-159306-scaled.jpg)]  bg-center bg-cover object-cover bg-no-repeat bg-fixed flex justify-center content-center"}>
                    <h1 className={"text-center text-3xl md:text-6xl font-bold text-white  self-center mx-2 md:mx-10"}>
                        Nous nous engageons à fournir des matériaux de construction de la
                        plus haute qualité pour garantir la solidité et
                        la durabilité de vos projets finis, assurant ainsi
                        des constructions robustes et pérennes.
                    </h1>
                </section>

                {/*commentaires*/}
            <section className={"flex md:px-20 px-3 flex-col space-y-5"}>
                <h1 className={'text-[30px] md:px-0 font-medium text-black'}>
                    Avis des clients
                </h1>

                <section className={"flex items-center content-center justify-center"}>
                    <Carousel
                        plugins={[
                            Autoplay({
                                delay: 2000,
                            }),
                        ]}
                        opts={{
                            align: "start",
                        }}
                        className="w-full  ">
                        <CarouselContent className={" w-full"}>
                            {
                                [1,2,3,4,5].map((items, index) => {
                                    return (
                                        <CarouselItem key={index} className={"md:basis-1/2 lg:basis-1/3"}>
                                            <div className="p-1">
                                                <Card className={"  "}>
                                                    <CardContent
                                                        className="flex flex-col space-y-3 md:space-y-0 md:flex-row  md:space-x-5 w-full   md:h-[200px] aspect-square items-center p-4">

                                                       <div >
                                                           <div className={"rounded-full  size-16 border-2 border-gray-400 flex items-center justify-center  "}>
                                                               <User className={"size-10"}/>
                                                           </div>

                                                       </div>

                                                        <div className={"flex flex-col space-y-4 w-full"}>
                                                            <Quote className={"size-8 self-start "} />
                                                                    <h1>
                                                                        Nous nous engageons à fournir des matériaux de construction de la
                                                                        plus haute qualité
                                                                    </h1>


                                                            <Quote className={"size-8 self-end text-right"} />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    )
                                })
                            }
                        </CarouselContent>
                        <CarouselPrevious/>
                        <CarouselNext/>
                    </Carousel>
                </section>

            </section>


            </div>

        </main>
    );
}
