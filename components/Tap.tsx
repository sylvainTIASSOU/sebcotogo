"use client"
import {Menu, Transition} from '@headlessui/react'
import Link from 'next/link';
import React, {useEffect, useState} from 'react'
import {DataInterface} from "@/lib/interfaces";
import {Skeleton} from './ui/skeleton';
import { Empty } from 'antd';
import {Api} from "@/app/api/Api";
import {ArticleModel} from "@/models/ArticleModel";


export default function Tap({ props }: Readonly<{
    props: React.ReactNode;
}>) {
    const [catId, setCatId] = useState(0);
    const [catName, setCatName] = useState('');
    const [categoriesData, setCategoriesData] = useState<any[]>([]);
    const [data, setData] = useState<ArticleModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingArticle, setLoadingArticle] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State to control menu open/close

    useEffect(() => {
        setLoading(true)
        Api.read('/api/category').then((catData: any[]) => {
            setCategoriesData(catData)
        }).finally(() => {
            setLoading(false)
        })
    }, []);
    return (
        <div className=" top-16 text-right w-auto">
            <Menu as="div"
                  className=" absolute left-5 inline-block text-left">
                {/*button props*/}
                <div>
                    <Menu.Button className="inline-flex w-auto justify-center rounded-md px-4 py-2 text-sm font-medium text-white hover:underline focus:underline-blue focus-visible:ring-2 focus-visible:ring-white/75">
                        {props}
                    </Menu.Button>
                </div>
                <Transition
                    as={"div"}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    className={"bg-white "}
                >
                    <div className={'p-3 md:h-[400px] md:w-[800px]  flex md:flex-row md:space-x-5 flex-col space-y-2 md:space-y-0'}>
                        <div className="w-[300px]   md:w-[200px] mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 ring-black/5 focus:outline-none">
                            <div className="px-1 py-1 flex flex-col space-y-5">

                                {
                                    loading ?
                                    [1,2,3,4,5].map((items) => {
                                        return <div key={items} className={"flex space-x-3"}>
                                                <Skeleton className={"h-5 w-5 rounded-full"}/>
                                                <Skeleton className={"w-[150px] h-5"}/>
                                            </div>

                                    })
                                        :
                                        categoriesData.map((cat, index) => {
                                            // @ts-ignore
                                            return <Menu.Item key={index} as={"div"}>

                                                 <Menu.Button
                                                    className={`hover:bg-buttonColor hover:text-white text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm `}
                                                    onClick={async () => {

                                                        setCatId(cat.id)
                                                        //const dataArray: DataInterface[] = [];
                                                        setLoadingArticle(true)
                                                        const fetchData = async (catIds: any) => {

                                                            try {
                                                                const articles: ArticleModel[] = await Api.read(`/api/article/getArticleByCategory/${catIds}`);
                                                                const dataArray: DataInterface[] = [];

                                                            /*    for (const articleElement of articles) {
                                                                    const imgData: any[] = await Api.getAll(`image/articleImage/${articleElement.article_id}`);
                                                                    const relevantImages = imgData.filter(img => img.article.id == articleElement.article_id);

                                                                    relevantImages.forEach(img => {
                                                                        dataArray.push({
                                                                            name: articleElement.article_articleName,
                                                                            price: String(articleElement.article_price),
                                                                            description: articleElement.article_description,
                                                                            articleId: String(articleElement.article_id),
                                                                            imageUrl: img.imageUrl,
                                                                            imageId: String(img.id)
                                                                        });
                                                                    });
                                                                }*/

                                                                setData(articles);
                                                            } catch (error) {
                                                                console.error("Error fetching data:", error);
                                                                setLoadingArticle(false)
                                                            }
                                                        };

                                                        await fetchData(cat.id);
                                                        setCatName(cat.catName);
                                                        setLoadingArticle(false)
                                                    }}
                                                >

                                                        <img src={String(cat.imageUrl)} alt={'cat'}
                                                            className="mr-2 h-10 w-10"
                                                            aria-hidden="true"
                                                        />
                                                     <h1 className={"text-lg font-bold"}>
                                                         {
                                                             cat.name
                                                         }
                                                     </h1>

                                                </Menu.Button>
                                        </Menu.Item>
                                    })
                                }
                            </div>

                        </div>



                        <div className={'flex flex-col '}>
                            <h1 className={'text-black font-bold mt-3 text-[25px]'}>{catName}</h1>
                            <div className={'grid  grid-cols-2 md:grid-cols-3 gap-4 '}>
                                {
                                    loadingArticle ?
                                        [1,2,3,4,5].map((items) => {
                                            return <div key={items} className={"flex flex-col space-y-3 items-center justify-center"}>
                                                <Skeleton className={"w-[100px] h-[100px] rounded-full"} />
                                                <Skeleton className={"w-[100px] h-5"} />
                                            </div>
                                        })
                                        :
                                        data.length != 0 ?
                                    data.map((prod, index) => {

                                        return <Link href={`/products/${prod.id}`}
                                            className={' hover:bg-buttonColor/40 hover:text-white bg-white shadow-2xl rounded-md p-3 flex ml-5  flex-col space-y-5 items-center justify-center'}
                                            key={index}>
                                                <img src={prod.imageUrl[0]} alt={'product'}
                                                    className={'bg-center flex items-center justify-center  bg-cover bg-no-repeat object-cover w-[100px] h-[100px] '} />

                                            <h1 className={'text-center hover:text-white text-black text-lg font-bold '}>
                                                {prod.name}
                                            </h1>
                                        </Link>


                                    }


                                    ) :
                                            <div className={"flex items-center justify-center"}>
                                                <Empty />
                                            </div>
                                }

                            </div>
                        </div>
                    </div>

                </Transition>
            </Menu>
        </div>
    )
}

