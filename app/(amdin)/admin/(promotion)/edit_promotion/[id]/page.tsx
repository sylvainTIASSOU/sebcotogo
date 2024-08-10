"use client"


import React, {useEffect, useState} from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {Button, Select, SelectProps} from "antd";
import { useToast } from "@/components/ui/use-toast";
import { CategoryModel } from "@/models/CategoryModel";
import ImageUpload from "@/app/(amdin)/componnents/image-uploadAdmin";
import { useRouter } from "next/navigation";
import { Api } from "@/app/api/Api";
import HeadDetaill from "@/app/(amdin)/componnents/HeadDetail";
import {ProviderModel} from "@/models/ProviderModel";
import {ArticleModel} from "@/models/ArticleModel";
import {PromotionModel} from "@/models/PromotionModel";
import {PromotionArticleModel} from "@/models/PromotionArticleModel";

export default function EditPromotion({params}: {params: {id: string}} ) {
    const [loading, setLoading] = useState(false);
    const route = useRouter()
    const { toast } = useToast();
    const [articles, setArticles] = useState<SelectProps['options']>();



    useEffect(() => {
        const fetch = async () =>{
            const resp = await Api.read(`/api/promotionArticle/${params.id}`)

            const initialDta = {
                beginDate:  resp.promotion.beginDate ||"",
                endDate:  resp.promotion.endDate ||"",
                newPrice:  resp.newPrice ||"",
                oldPrice:  resp.oldPrice ||"",
                productId:  resp.productId ||"",
            }

            formik.setValues(initialDta);
        }
        fetch()
        //loard provider
        Api.read('/api/article').then((value: any[]) => {
            const newdep: SelectProps['options'] = [];
            value.forEach((element: ArticleModel) => {
                newdep.push({
                    value: String(element.id),
                    label: String(element.name),
                })
            });
            setArticles(newdep)

        })
    }, []);



    const formik = useFormik({
        initialValues: {
            beginDate: "",
            endDate: "",
            newPrice: "",
            oldPrice: "",
            productId: "",
        },

        validationSchema: Yup.object({
          beginDate: Yup.string().required("La date de debut est obligatoire"),
          endDate: Yup.string().required("La date de fin est obligatoire"),
            newPrice: Yup.number().required("La date de fin est obligatoire"),
            oldPrice:    Yup.number().required("La date de fin est obligatoire"),
            productId: Yup.string().required("La date de fin est obligatoire"),

        }),
        onSubmit: async (values) => {
            setLoading(true)
            const promotionModel = new PromotionModel(values.beginDate, values.endDate,"description" );
            const resp = await Api.update('/api/promotion', promotionModel);
            if(resp.ok) {
                const promotionArticleModel = new PromotionArticleModel(+values.newPrice, +values.oldPrice, +resp.promotion.id, +values.productId);
                const resp2 = await Api.update('/api/promotionArticle', promotionArticleModel);
                if(resp2.ok) {
                    const resp3: ArticleModel = await Api.read(`/api/article/${values.productId}`)
                    const articlemodel = new ArticleModel(resp3.name, +values.newPrice, resp3.description, resp3.imageUrl, resp3.categoryId, resp3.tax,resp3.id, resp3.isVisible, resp3.isActived )
                    await Api.update(`/api/article/${values.productId}`, articlemodel)
                    toast({
                        title: 'Promotion Modifier avec succès',
                    });
                    setLoading(false)
                    formik.resetForm()
                } else {
                    console.log(resp2)
                    toast({
                        variant: 'destructive',
                        title: 'Une erreur est survenu lors de l enregistrement',
                        description: 'réessayer'
                    });
                    setLoading(false)
                }

            }
            console.log(values)
        }
    })
    return (
        <main className={'my-20 mx-20 flex flex-col space-y-10'}>
            <HeadDetaill title={"Editer une promotion"} subtitle={"Gestion des promotion"} />
            
           
            <Separator className={'w-full'} />

            <section className={"border-2 rounded-3xl py-5 "}>
                <form onSubmit={formik.handleSubmit} className={'flex flex-col space-y-5 items-center justify-center'}>

                    <div className={"flex space-x-10"}>
                        {/*first input row*/}

                            <div className={'flex flex-col space-y-3'}>
                                <label
                                    className={formik.touched.beginDate && formik.errors.beginDate ? 'text-red-600' : ''}>{formik.touched.beginDate && formik.errors.beginDate ? formik.errors.beginDate : "Date de debut"}<span
                                    className={'text-red-600'}>*</span> </label>
                                <Input type={'date'}
                                       name={'beginDate'}
                                       value={formik.values.beginDate}
                                       onChange={formik.handleChange}
                                       className={'bg-white border-none h-[35px] w-[250px]'}/>
                            </div>

                            <div className={'flex flex-col space-y-3'}>
                                <label
                                    className={formik.touched.endDate && formik.errors.endDate ? 'text-red-600' : ''}> {formik.touched.endDate && formik.errors.endDate ? formik.errors.endDate : "Date de fin"}
                                    <span className={'text-red-600'}></span> </label>
                                <Input type={'date'}
                                       name={'endDate'}
                                       value={formik.values.endDate}
                                       onChange={formik.handleChange}
                                       className={'bg-white border-none h-[35px] w-[250px]'}/>
                            </div>

                    </div>


                    <div className={"flex space-x-10"}>
                        {/*new product*/}
                        <div className={'flex flex-col space-y-3'}>
                            <label
                                className={formik.touched.productId && formik.errors.productId ? 'text-red-600' : ''}> {formik.touched.productId && formik.errors.productId ? formik.errors.productId : "L'article en promotion"}
                                <span className={'text-red-600'}></span> </label>
                            <Select
                                defaultValue={formik.values.productId}
                                value={formik.values.productId}
                                placeholder=""

                                onSelect={async (value) => {
                                    setLoading(true)
                                    formik.values.productId = String(value)
                                    const resp = await Api.read(`/api/article/${value}`);
                                    formik.values.oldPrice = resp.price
                                    setLoading(false)
                                }}
                                options={articles}
                                className="bg-white border-none h-[35px] w-[250px]"
                            />
                        </div>

                        {/*new price*/}
                        <div className={'flex flex-col space-y-3'}>
                            <label
                                className={formik.touched.newPrice && formik.errors.newPrice ? 'text-red-600' : ''}> {formik.touched.newPrice && formik.errors.newPrice ? formik.errors.newPrice : "Nouveau prix"}
                                <span className={'text-red-600'}></span> </label>
                            <Input type={'number'}
                                   name={'newPrice'}
                                   value={formik.values.newPrice}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>
                    </div>


                    {/* old price*/}
                    <div className={'flex flex-col space-y-3'}>
                        <label
                            className={formik.touched.oldPrice && formik.errors.oldPrice ? 'text-red-600' : ''}> {formik.touched.oldPrice && formik.errors.oldPrice ? formik.errors.oldPrice : "Encient prix"}
                            <span className={'text-red-600'}></span> </label>
                        <Input type={'number'}
                               name={'oldPrice'}
                               value={formik.values.oldPrice}
                               onChange={formik.handleChange}
                               className={'bg-white border-none h-[35px] w-[250px]'}/>
                    </div>


                    <div className={"flex space-x-5"}>
                        <Button htmlType={"button"} type={'dashed'} onClick={() => formik.resetForm()}
                                size={'large'} className={'w-auto '}>Effacer</Button>
                        <Button htmlType={"submit"} type={"default"} size={'large'} loading={loading}
                                className={'w-auto bg-black text-white'}>Modifier</Button>
                    </div>
                </form>
            </section>
        </main>
    );
}