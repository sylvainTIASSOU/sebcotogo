"use client"
import {Separator} from "@/components/ui/separator";
import React, {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useFormik} from "formik";
import * as Yup from "yup";
import type {SelectProps} from 'antd';
import {Button, Select} from 'antd';
import {Methodes} from "@/resource_methodes/methodes";
import {useToast} from "@/components/ui/use-toast";
import {CategoryModel} from "@/models/CategoryModel";
import {CharacteristicModel} from "@/models/characteristicModel";
import {ArticleModel} from "@/models/ArticleModel";
import {CharacteristicArticleModel} from "@/models/CharacteristicArticle";
import ImageUpload from "@/app/(amdin)/componnents/image-uploadAdmin";
import {Api} from "@/app/api/Api";
import HeadDetaill from "@/app/(amdin)/componnents/HeadDetail";
import {ProviderModel} from "@/models/ProviderModel";
import {StockModel} from "@/models/StockModel";
import {StockArticleModel} from "@/models/StockArticleModel";

let ImagesArray: string[] = [];
let characteristicVal: string[] = [];

const EditArticle = ({params}: {params: {id: string}}) => {
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string>('');
    const [images2, setImages2] = useState<string>('');
    const [images3, setImages3] = useState<string>('');
    const [images4, setImages4] = useState<string>('');
    const [categoryArrays, setCategoryArrays] = useState<SelectProps['options']>();
    const [characteristicArrays, setCharacteristicArrays] = useState<SelectProps['options']>()
    const [imagesArrays, setImagesArrays] = useState<string[]>([])
    const {toast} = useToast();
    const [characteristicValues, setCharacteristicValues] = useState<string[]>([])
    const [providers, setProviders] = useState<SelectProps['options']>()
    const [stockId, setStockId] = useState("")
    const [stockArticleId, setStockArticleId] = useState("")
    //const [charactId, setStockArticleId] = useState("")
    useEffect(() => {
        const fetch = async () => {
            // @ts-ignore
            const resp: ArticleModel = await Api.read(`/api/article/${params.id}`);
            //get characts
            const characts = await Api.read(`/api/productCharacteristic/getCharacteristicByArticleId/${resp.id}`);


            //get stockArticle
            const stockArticle = await Api.read(`/api/stockArticle/getByArticleId/${resp.id}`);


            setStockArticleId(stockArticle.id)
            setStockId(stockArticle.stockId)
            const initialData = {

                provider: String(stockArticle.stock?.provider.id),
                stockPrice: String(stockArticle?.stockPrice),
                name: resp.name|| "",
                price: String(resp.price) || "",
                quantity: String(stockArticle.quantity) || "",
                category: String(resp.categoryId) || "",
                description: resp.description || "",
                tax: String(resp.tax) || "",
            }
            ImagesArray = resp.imageUrl;
            setImages(resp.imageUrl[0])
            setImages2(resp.imageUrl[1])
            setImages3(resp.imageUrl[2])
            setImages4(resp.imageUrl[3])
           // formik.setValues(initialData);
        }

        fetch();
        //loard provider
        Api.read('/api/provider/getProviderByStatus/PROVIDER').then((value: any[]) => {
            const newdep: SelectProps['options'] = [];
            value.forEach((element: ProviderModel) => {
                newdep.push({
                    value: String(element.id),
                    label: String(element.name),
                })
            });
            setProviders(newdep)
        })
        //loard categories
        Api.read('/api/category').then((value: any[]) => {
            const newdep: SelectProps['options'] = [];
            value.forEach((element: CategoryModel) => {
                newdep.push({
                    value: String(element.id),
                    label: String(element.name),
                })
            })
            setCategoryArrays(newdep)
        })
        //loard characteristic data
        Api.read('/api/characteristic').then((value: CharacteristicModel[]) => {

            const newdep: SelectProps['options'] = [];
            value.forEach((element: CharacteristicModel) => {
                newdep.push({
                    value: String(element.id),
                    label: String(element.name),
                })
            });
            setCharacteristicArrays(newdep);


        })

    }, []);


    function resetForm(values: any) {
        values.field = "";
        values.provider = ""
        values.stockPrice = ""
        values.name = "";
        values.price = "";
        values.quantity = "";
        values.category = "";
        values.characteristic = [];
        values.description = "";
        values.tax = "";
        setImages('');
        setImages2('');
        setImages3('');
        setImages4('');
        ImagesArray = [];
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            price: "",
            quantity: "",
            category: "",
            description: "",
            tax: "",
            provider: "",
            stockPrice: ""
        },
        validationSchema: Yup.object({
            field: Yup.string().optional(),
            provider: Yup.string().required("Le fournisseur est obligatoire"),
            stockPrice: Yup.string().required("Le prix du stock est obligatoire"),
            name: Yup.string().required("Le nom de l'aricle est obligatoire"),
            price: Yup.number().required('le prix est obligatoire'),
            quantity: Yup.number().required("La quantité est obligatoire"),
            category: Yup.string().required("la categorie est obligatoire"),
            // characteristic: Yup.ArraySchema.required("le caracteristique est obligatoire"),
            description: Yup.string().optional(),
            tax: Yup.string().optional(),
        }),
        onSubmit: async (values) => {
            setLoading(true)

            if (values.category != "" && characteristicValues.length != 0) {
                if (ImagesArray.length != 0) {
                    const articleModel = new ArticleModel(values.name, Number(values.price), values.description, ImagesArray, Number(values.category), Number(values.tax), +params.id);
                    const resp = await Api.update(`/api/article/${params.id}`, articleModel);

                    if (resp.ok) {
                        console.log(resp);
                        const id = resp.product.id;
                        characteristicValues.forEach((element) => {
                            const characteristicArticleModel = new CharacteristicArticleModel(Number(id), Number(element))
                            Api.update(`/api/productCharacteristic`, characteristicArticleModel)
                        });


                        //ajout de l'articlz au stock
                        const stockModel = new StockModel(+values.provider);
                        const respStock = await Api.update(`/api/stock/${stockId}`, stockModel)
                        if (respStock.ok) {
                            const stockId = respStock.stock.id;
                            console.log(respStock);
                            //ajout du
                            const stockArticleModel = new StockArticleModel(+values.quantity, +values.stockPrice, +id, +stockId)
                            const resp2 = await Api.update(`/api/stockArticle/${stockArticleId}`, stockArticleModel);

                            if (resp2.ok) {
                                toast({
                                    title: 'Article modifié avec succès',
                                });
                                setLoading(false)
                                resetForm(values)
                            }
                            else {

                                console.log(resp2)
                                toast({
                                    variant: 'destructive',
                                    title: 'Une erreur est survenu lors de l enregistrement',
                                    description: 'réessayer'
                                });
                                setLoading(false)
                            }
                        }
                        else {
                            console.log(respStock)
                            toast({
                                variant: 'destructive',
                                title: 'Une erreur est survenu lors de l enregistrement',
                                description: 'réessayer'
                            });
                            setLoading(false)
                        }



                    } else {
                        console.error(resp);
                        toast({
                            variant: 'destructive',
                            title: 'Une erreur est survenu lors de l enregistrement',
                            description: 'réessayer'
                        });
                        setLoading(false)
                    }
                } else {
                    toast({
                        variant: 'destructive',
                        title: "Ajouter au moin une image",
                        description: 'Réessayer'
                    });
                    setLoading(false)

                }

            } else {
                toast({
                    variant: 'destructive',
                    title: "Selectioner la catégorie et une caracteristique",
                    description: 'Réessayer'
                });
                setLoading(false)

            }

            setLoading(false)
        }


    });

    return (
        <main className={'my-20 px-20 flex flex-col space-y-10'}>
            <HeadDetaill title={"Editer un Arcticle"} subtitle={"Gestion des articles"}/>

            <Separator className={'w-full my-5'}/>

            <section>
                <form onSubmit={formik.handleSubmit} className={'flex flex-col space-y-10 w-[950px]'}>
                    {/*image*/}
                    <div>
                        <Label>Image <span className={'text-red-600'}>*</span> </Label>
                        <div className={"grid grid-cols-1 md:grid-cols-4 gap-4"}>

                            <div>
                                <ImageUpload
                                    value={images}
                                    disable={loading}
                                    onChange={(url) => {
                                        if (url != "") {
                                            setImages(url);
                                            ImagesArray.push(url)
                                            console.log(ImagesArray)
                                        }
                                    }}
                                    onRemove={() => {
                                        const index = ImagesArray.indexOf(images);
                                        if (index !== -1) {
                                            ImagesArray.splice(index, 1);
                                        }
                                        setImages("");
                                    }}
                                />
                            </div>
                            <div>
                                <ImageUpload
                                    value={images2}
                                    disable={loading}
                                    onChange={(url) => {
                                        if (url != "") {
                                            setImages2(url);
                                            ImagesArray.push(url)
                                            console.log(ImagesArray)
                                        }
                                    }}
                                    onRemove={() => {
                                        setImages2("");
                                        const index = ImagesArray.indexOf(images2);
                                        if (index !== -1) {
                                            ImagesArray.splice(index, 1);
                                        }
                                    }}
                                />
                            </div>
                            <div>
                                <ImageUpload
                                    value={images3}
                                    disable={loading}
                                    onChange={(url) => {
                                        if (url != "") {
                                            setImages3(url);
                                            ImagesArray.push(url)
                                            console.log(ImagesArray)
                                        }
                                    }}
                                    onRemove={() => {
                                        setImages3("");
                                        const index = ImagesArray.indexOf(images3);
                                        if (index !== -1) {
                                            ImagesArray.splice(index, 1);
                                        }
                                    }}
                                />
                            </div>
                            <div>
                                <ImageUpload
                                    value={images4}
                                    disable={loading}
                                    onChange={(url) => {


                                        if (url != "") {
                                            ImagesArray.push(url)
                                            setImages4(url);
                                            console.log(ImagesArray)
                                        }

                                    }}
                                    onRemove={() => {
                                        setImages4("");
                                        const index = ImagesArray.indexOf(images4);
                                        if (index !== -1) {
                                            ImagesArray.splice(index, 1);
                                        }
                                        console.log(ImagesArray)
                                    }}

                                />
                            </div>

                        </div>


                    </div>

                    {/*first input row*/}
                    <div className={'flex justify-between content-between'}>

                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.name && formik.errors.name ? 'text-red-600' : ''}>{formik.touched.name && formik.errors.name ? formik.errors.name : "Nom de l'article"}<span
                                className={'text-red-600'}>*</span> </Label>
                            <Input type={'text'}
                                   name={'name'}
                                   value={formik.values.name}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>

                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.price && formik.errors.price ? 'text-red-600' : ''}> {formik.touched.price && formik.errors.price ? formik.errors.price : "Prix"}
                                <span className={'text-red-600'}>*</span> </Label>
                            <Input type={'number'}
                                   name={'price'}
                                   value={formik.values.price}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>

                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.quantity && formik.errors.quantity ? "text-red-600" : ""}> {formik.touched.quantity && formik.errors.quantity ? formik.errors.quantity : "Quantité"}
                                <span className={'text-red-600'}>*</span> </Label>
                            <Input type={'number'}
                                   name={'quantity'}
                                   value={formik.values.quantity}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>

                    </div>


                    {/*second input row*/}
                    <div className={'flex justify-between content-between'}>
                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.category && formik.errors.category ? "text-red-600" : ""}> {formik.touched.category && formik.errors.category ? formik.errors.category : "Catégorie"}
                                <span className={'text-red-600'}>*</span> </Label>

                            <Select
                                placeholder=""
                                value={formik.values.category}
                                defaultValue={formik.values.category}
                                onSelect={(value) => {
                                    formik.values.category = String(value)
                                }}
                                options={categoryArrays}
                                className="bg-white border-none h-[35px] w-[250px]"
                            />

                        </div>

                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={""}> Caractéristiques
                                <span className={'text-red-600'}>*</span> </Label>
                            <Select
                                mode="multiple"
                                placeholder=""
                                onSelect={(value) => {
                                    characteristicVal.push(value as string)
                                    setCharacteristicValues(characteristicVal);
                                }}

                                options={characteristicArrays}
                                className="bg-white border-none h-[35psx] w-[250px]"
                            />

                        </div>

                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.errors.tax ? "text-red-600" : ""}> {formik.errors.tax ? formik.errors.tax : "Taxe"}
                                <span className={'text-red-600'}></span> </Label>
                            <Input type={'number'} name={'tax'}
                                   value={formik.values.tax}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>

                    </div>

                    {/*tierty input row*/}
                    <div className={'flex justify-between content-between'}>

                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.provider && formik.errors.provider ? "text-red-600" : ""}> {formik.touched.provider && formik.errors.provider ? formik.errors.provider : "fournisser"}
                                <span className={'text-red-600'}>*</span> </Label>

                            <Select
                                placeholder=""
                                defaultValue={formik.values.provider}
                                value={formik.values.provider}
                                onSelect={(value) => {
                                    formik.values.provider = String(value)
                                }}
                                options={providers}
                                className="bg-white border-none h-[35px] w-[250px]"
                            />

                        </div>

                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.stockPrice && formik.errors.stockPrice ? 'text-red-600' : ''}> {formik.touched.stockPrice && formik.errors.stockPrice ? formik.errors.stockPrice : "Prix du stock"}
                                <span className={'text-red-600'}>*</span> </Label>
                            <Input type={'number'}
                                   name={'stockPrice'}
                                   value={formik.values.stockPrice}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>


                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.description && formik.errors.description ? "text-red-600" : ""}> {formik.touched.description && formik.errors.description ? formik.errors.description : "Description"}
                                <span className={'text-red-600'}></span> </Label>
                            <Input type={'text'} name={'description'}
                                   value={formik.values.description}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[85px] w-[250px]'}/>
                        </div>
                    </div>


                    <div className={"flex space-x-5 "}>
                        <Button htmlType={"reset"} type={'dashed'} onClick={() => resetForm(formik.values)}
                                size={'large'} className={'w-auto '}>Effacer</Button>
                        <Button htmlType={"submit"} size={'large'} loading={loading}
                                className={'w-auto bg-black text-white '}>Modifier</Button>
                    </div>
                </form>
            </section>
        </main>
    );
}
export default EditArticle;