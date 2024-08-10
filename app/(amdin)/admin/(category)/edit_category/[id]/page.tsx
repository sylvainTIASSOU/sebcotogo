"use client"
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import * as Yup from "yup"
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {Button} from "antd";
import {CategoryModel} from "@/models/CategoryModel";
import ImageUpload from "@/app/(amdin)/componnents/image-uploadAdmin";
import {Methodes} from "@/resource_methodes/methodes";
import HeadDetaill from "@/app/(amdin)/componnents/HeadDetail";
import {Api} from "@/app/api/Api";

let ImagesArray: string[] = [];

export default function EditCategory({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(false);
    const route = useRouter();
    const [images, setImages] = useState<string>('')
    const { toast } = useToast();
    useEffect(() => {
        const fetch = async () => {
            // @ts-ignore
            const resp: CategoryModel = await Api.read(`/api/category/${params.id}`);
            const initialData = {
                name: resp.name || "",
                description: resp.description || ""
            }
            setImages(resp.imageUrl)
             formik.setValues(initialData);
        }

        fetch();

    }, []);
    function resetForm(values: any) {

        values.name = "";
        values.description = "";


        if (Methodes.removeAllArray(ImagesArray)) {
            setImages('');

        }
    }

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Le nom est obligatoire"),
            description: Yup.string().optional(),
        }),
        onSubmit: async (values) => {
            setLoading(true)
            const categoryModel = new CategoryModel(values.name, images, values.description);
            const resp = await Api.update(`/api/category/${params.id}`, categoryModel)
            if (resp.ok) {
                toast({
                    title: "Categorie modifier avec succès"
                })

                route.refresh()
            }
            else {
                console.error(resp)
                toast({
                    title: "Une erreur est survenue lors de la modification",
                    description: "réessayer!!",
                    variant: "destructive"
                });
                setLoading(false)
            }
            setLoading(false)
        }
    })
    return (
        <main className={'mt-20 mx-20'}>

            <HeadDetaill title={"Editer la Categorie"} subtitle={"Gestion des caractéristiques"} />
           

            <Separator className={'w-full'} />

            <section>
                <form onSubmit={formik.handleSubmit} className={'flex flex-col space-y-3 w-[950px]'}>
                    {/*image*/}
                    <div>
                        <label>Image <span className={'text-red-600'}>*</span> </label>
                        <div className={"flex justify-between content-between"}>

                                    <div >
                                        <ImageUpload
                                            value={images}
                                            disable={loading}
                                            onChange={ async (url: any) => {


                                                if (url != "") {

                                                    setImages(url);

                                                }

                                            }}
                                            onRemove={ async () => {
                                                    setImages("");
                                            }}

                                        />
                                    </div>


                        </div>
                    </div>

                    {/*first input row*/}
                    <div className={'flex mt-5 space-x-20'}>
                        <div className={'flex flex-col space-y-3'}>
                            <label
                                className={formik.touched.name && formik.errors.name ? 'text-red-600' : ''}>{formik.touched.name && formik.errors.name ? formik.errors.name : "Nom du Catégorie"}<span
                                    className={'text-red-600'}>*</span> </label>
                            <Input type={'text'}
                                name={'name'}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                className={'bg-white border-none h-[35px] w-[250px]'} />
                        </div>

                        <div className={'flex flex-col space-y-3'}>
                            <label
                                className={formik.touched.description && formik.errors.description ? 'text-red-600' : ''}> {formik.touched.description && formik.errors.description ? formik.errors.description : "Description"}
                                <span className={'text-red-600'}></span> </label>
                            <Input type={'text'}
                                name={'description'}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                className={'bg-white border-none h-[65px] w-[250px]'} />
                        </div>
                    </div>


                    <div className={"flex space-x-5 relative top-14"}>
                        <Button htmlType={"button"} type={'dashed'} onClick={() => resetForm(formik.values)}
                            size={'large'} className={'w-auto '}>Effacer</Button>
                        <Button htmlType={"submit"} size={'large'} loading={loading} className={'w-auto '}>Ajouter</Button>
                    </div>
                </form>
            </section>
        </main>
    );
}