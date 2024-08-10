"use client"
import CardArt1 from "@/components/CardArt1";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {FaMinus, FaPlus} from "react-icons/fa6";
import {FaCartPlus} from "react-icons/fa";
import {useToast} from "@/components/ui/use-toast"
import {ToastAction} from "@radix-ui/react-toast";
import {useDispatch} from "react-redux";
import CartModel from "@/models/CartModel";
import {addProduct} from "@/redux/features/cart-slice";
import {ArticleModel} from "@/models/ArticleModel";
import {DataInterface} from "@/lib/interfaces";
import Image from "next/image";
import {Api} from "@/app/api/Api";
import {Skeleton} from "@/components/ui/skeleton";
import EmptyData from "@/components/EmptyData";
import {BsCart} from "react-icons/bs";
import {useRouter} from "next/navigation";


const ProductPage = ({params}: { params: { productId: string } }) => {
    const [imageUrls, setImageUrls] = useState('');

    const [isClicked, setIsClick] = useState(0);
    const [qte, setQte] = useState(1);
    const {toast} = useToast();
    const [productData, setProductData] = useState<ArticleModel>()
    const [characteristicData, setCharacteristicData] = useState<any[]>([])
    const [imageData, setImageData] = useState<any[]>([])
    const [data, setData] = useState<DataInterface[]>([]);
    const [price, setPrice] = useState(0);
    const [priceTotal, setPriceTotal] = useState(0);
    const [loadingArt, setLoadingArt] = useState(false);
    const [loadingCharact, setLoadingCharact] = useState(false);
    const [loading, setLoading] = useState(false);
    const [articlesData, setArticlesData] = useState<ArticleModel[]>([])
    const route = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        setLoadingArt(true)
        setLoadingCharact(true)
        setLoading(true)
        Api.read(`/api/productCharacteristic/getCharacteristicByArticleId/${params.productId}`).then((articleData: any[]) => {
            setCharacteristicData(articleData);
            console.log(articleData)
        }).finally(() => {
            setLoadingCharact(false);
        });

        Api.read(`/api/article/${params.productId}`).then((articleData: any) => {
            setProductData(articleData);
            setPrice(articleData.price);
           setPriceTotal(articleData.price)
            setImageUrls(articleData.imageUrl[0]);
        }).finally(() => {
            setLoadingArt(false);
        });

        Api.read('/api/article').then((data) => {
            setArticlesData(data)
        }).finally(() => {
            setLoading(false);
        });


        /*const fetchData = async () => {
            const dataArray: DataInterface[] = [];
            Api.getAll('article/all').then((articles: ArticleModel[]) => {
                articles.forEach((articleElement) => {
                    Api.getAll(`image/articleImage/${articleElement.id}`).then((imgData: any[]) => {
                        imgData.forEach((img) => {
                            if (img.article.id == articleElement.id) {
                                dataArray.push({
                                    name: articleElement.name,
                                    price: String(articleElement.price),
                                    description: articleElement.description,
                                    articleId: String(articleElement.id),
                                    imageUrl: img.imageUrl,
                                    imageId: String(img.id)
                                })
                            }

                        })
                    })
                })
                setData(dataArray);
            })

        }

        fetchData();*/


    }, []);


    return (
        <div className={" mt-[35%] md:mt-[10%] px-3 md:px-[20rem] flex flex-col space-y-20"}>
            <section className={''}>
                {
                    loadingArt ?
                        <div className={"flex flex-col space-y-3"}>
                            <Skeleton className={"w-[150px] h-8 "}/>
                            <Skeleton className={"w-[250px] h-24 "}/>
                        </div>
                        :
                        <h1 className={"text-4xl md:text-6xl font-bold"}>{productData?.name}</h1>
                }
                <p className={"text-xl  md:w-[600px]"}>
                    {productData?.description}
                </p>
            </section>

            {/*div content image and caracteristic*/}
            <section
                className={'flex  flex-col w-auto space-y-5 md:flex-row md:content-between md:justify-between mt-10'}>
                {/* images*/}
                <div className={'flex flex-col w-full space-y-3 md:flex-row  md:space-x-5'}>
                    {/*liste image*/}
                    <div className={"flex space-x-5 md:flex-col md:space-y-5 md:space-x-0"}>
                        {
                            loadingArt ?
                                [1,2,3,4]. map((items) => {
                                    return <Skeleton key={items} className={"w-[50px] h-[50px] rounded-sm"}/>
                                })

                                :
                            productData?.imageUrl.map((data, index) => {
                                return <div key={index}
                                            onClick={() => {
                                                setImageUrls(data);
                                            }}
                                            className={data == imageUrls ? "w-[50px] h-[50px] rounded-sm border-2 border-buttonColor p-1 flex items-center justify-center" : "flex items-center justify-center p-1 w-[50px] h-[50px] rounded-sm border-2 border-black"}
                                >
                                    <img src={data} className={"bg-cover  bg-center"} alt={"image"}/>
                                </div>
                            })
                        }
                    </div>

                    {/* image*/}
                    <div className={" shadow-2xl bg-white md:w-[400px] h-[400px] p-3"}>
                        {
                            loadingArt ?
                                <Skeleton className={"md:w-[400px] h-[400px]"}/> :
                                <img
                                    src={imageUrls}
                                    alt={'image'}
                                    className={'flex bg-cover bg-center  w-full h-full'}
                                />
                        }

                    </div>


                    {/* caracterisques*/}
                    <div className={'bg-white flex flex-col justify-between content-between rounded-[15px] md:w-[500px] p-5 h-auto  md:ml-[10%]'}>
                    <h1 className={'text-xl font-bold underline'}>Caractéristiques</h1>

                        {/* caracteristiques data*/}
                        <div className={"flex space-x-5 justify-between content-between items-center"}>
                            <div className={'mt-3 flex flex-col space-y-3'}>
                                {
                                    characteristicData.map((charact, index) => {
                                        return <div key={index} className={'flex space-x-1'}>
                                            <h1 className={"text-lg"}>{charact.Characteristic.name}</h1>
                                            <h1 className={"font-bold text-lg text-sky-400"}>: {charact.Characteristic.value} </h1>
                                        </div>


                                    })
                                }
                            </div>

                            <div className={"text-[20px] font-bold text-white bg-sky-400 p-3 rounded-md"}>
                                {priceTotal} TTC
                            </div>
                        </div>


                        {/* button to add product*/}
                        <div className={'flex flex-col mt-[10%] space-y-3'}>

                            <div className={'flex space-x-10 self-center'}>
                                <Button variant={'outline'}
                                        size={'icon'}
                                        onClick={() => {
                                            if (qte > 1) {
                                                setQte(qte - 1);
                                                setPriceTotal( priceTotal-price);
                                            }
                                        }}
                                >
                                    <FaMinus className={'w-[25]px] h-[25px]'}/>
                                </Button>


                                <div className={'text-[30px] font-bold'}>
                                    {qte}
                                </div>

                                <Button variant={'outline'}
                                        size={'icon'}
                                        onClick={() => {
                                            setQte(qte + 1);
                                            setPriceTotal( priceTotal + price);
                                        }}
                                >
                                    <FaPlus className={'w-[25]px] h-[25px]'}/>
                                </Button>
                            </div>

                            <Button className={'bg-buttonColor flex space-x-3'}
                                    size={'lg'}
                                    onClick={() => {
                                        if (qte < 1) {
                                            toast({
                                                title: "Panier",
                                                description: "ajouter au moin une article!!",
                                                variant: 'destructive',
                                                action: <ToastAction altText="Reessayer">Try again</ToastAction>,
                                            });
                                        } else {
                                            const modelCart = new CartModel(String(productData?.id), String(productData?.name), imageUrls, Number(productData?.price), Number(price * qte), qte);
                                            dispatch(addProduct(modelCart));
                                            setQte(1);
                                            setPriceTotal(price);
                                            toast({
                                                title: "Panier",
                                                description: "Article ajouté au panier!!",
                                            })
                                        }

                                    }

                                    }

                            >

                                <h1>
                                    Ajouter au panier
                                </h1>
                                <FaCartPlus className={'text-white w-[20px] h-[20px]'}/>

                            </Button>
                        </div>

                    </div>
                </div>
            </section>


            {/*secrion 2*/}
            <section className={'mt-20 flex flex-col space-y-10'}>
                <h1 className={' text-3xl md:text-5xl  font-bold'}>Autres recommandations.</h1>

                <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
                    {
                        loading ?
                            [1, 2, 3].map((items) => {
                                return (
                                    <Skeleton key={items}
                                              className={"shadow-xl p-3 md:max-w-[25em] h-[10em]  rounded-lg flex  justify-between content-between"}/>
                                );
                            })
                            :
                            articlesData.length == 0 ?
                                <EmptyData/>
                                :
                                articlesData.map((items, index) => {
                                    if(index < 4) {
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
                                    }

                                })
                    }
                </div>
            </section>
        </div>
    );
}
export default ProductPage;