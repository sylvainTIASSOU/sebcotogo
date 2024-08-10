"use client"
import React, {useEffect, useState} from 'react';
import {ArticleModel} from "@/models/ArticleModel";
import Card2 from "@/components/Card2";
import {Skeleton} from "@/components/ui/skeleton";
import {DataInterface} from "@/lib/interfaces";
import Resources from "@/lib/resources";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {CategoryModel} from "@/models/CategoryModel";
import {Api} from "@/app/api/Api";
import {Button} from "@/components/ui/button";
import {BsCart} from "react-icons/bs";

export default  function Articles({params}: {params: {catId: string}})  {
    const [categories, setCategories] = useState<CategoryModel[]>([])
    const [data, setData] = useState<ArticleModel[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCat, setIsLoadingCat] = useState(false);
    const [catId, setCatId] = useState(params.catId);
    const route = useRouter()

    useEffect(() => {

        setIsLoading(true)
        setIsLoadingCat(true)
        Api.read(`/api/article/getArticleByCategory/${catId}`).then((data) => {
            setData(data)
        }).finally(() => {
            setIsLoading(false)
        });;


        Api.read("/api/category").then((cat) => {
            setCategories(cat)
        }).finally(() => {
            setIsLoadingCat(false)
        });
    }, [catId]);

    return (
        <div className={'my-[35%] md:my-[10%] px-3 md:px-20 flex flex-col'}>
            <h1 className={"font-bold text-[35px]"}>Nos Articles</h1>

            <div className={"flex md:space-x-10 md:flex-row flex-col space-y-2"}>
                {/*categories*/}
                <div className={" hidden md:flex flex-col space-y-3 h-auto w-[350px] rounded-xl  items-start  py-3"}>
                    {
                        isLoadingCat ?
                            [1, 2, 3, 4].map((el, index) => {
                                return <div>
                                    <Skeleton className="h-[12px] w-full rounded-xl"/>
                                </div>
                            })
                            :

                            categories.map((cats, index) => {

                                return <button key={index}
                                           onClick={() => {
                                               setCatId(String(cats.id))
                                               //route.push(`/articles/${cats.id}`)
                                           }}
                                           className={ cats.id == +catId ? "text-[20px] font-bold text-blue-600 px-3 flex space-x-3 border border-blue-600 bg-purple-100 rounded-md w-[350px] py-2 shadow-md" : " shadow-md  hover:bg-purple-100 py-2 rounded-md w-[350px] border border-blue-600 px-3 flex space-x-3 hover:accent-gray-400 text-[20px] font-regular"}
                                >
                                    <Image src={cats.imageUrl}
                                           alt={"category"}
                                           width={30}
                                           height={30}
                                           priority
                                           className={"bg-center object-cover bg-cover bg-content "}
                                    />
                                   <h1>{cats.name}</h1>
                                </button>


                        })
                    }
                </div>

                {/*Articles*/}
                <div className={'grid grid-cols-1 md:grid-cols-3 gap-4'}>
                    { isLoading ?
                        [1,2,3,1,1,1,1,1,1].map((el, index) => {
                            return <div className={""} key={index}>
                                <Skeleton className="h-[125px] w-auto md:w-[250px] rounded-xl"/>
                            </div>
                        })
                        :
                        data.length == 0 ?
                            <div className={"flex flex-col items-center justify-center  md:relative md:left-[70%] w-full"}>
                            <Image src={"/images/sammy-sailor-looking-through-telescope-off-the-mast.gif"}
                                       alt={"data empty"}
                                       priority
                                       width={700}
                                       height={700}
                                       className={"bg-center bg-cover"}
                                />

                                <h1 className={"text-center font-regular text-blue-600 text-[25px]"}>Pas d'article pour cette catégorie</h1>
                            </div> :
                            data.map((items, index) => {

                                return (
                                    <div key={index}
                                         className={"shadow-xl bg-white p-3 md:w-[15em] rounded-lg flex flex-col space-y-5 justify-between content-between"}>
                                        <Image src={items.imageUrl[0]} alt={"image"} width={150} height={150}
                                               className={"object-cover bg-cover bg-center self-center"}/>
                                        <div className={"flex justify-between content-between items-center"}>
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


                            })
                    }
                </div>
            </div>
        </div>
    );
}

