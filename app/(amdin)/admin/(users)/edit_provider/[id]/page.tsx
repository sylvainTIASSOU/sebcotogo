"use client";
import HeadDetaill from "@/app/(amdin)/componnents/HeadDetail";
import {Separator} from "@/components/ui/separator";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button, Select} from "antd";
import {ProviderModel} from "@/models/ProviderModel";
import {Api} from "@/app/api/Api";
import {useToast} from "@/components/ui/use-toast";


export default function EditPovider({params}: {params: {id: string}}) {
    const [loading, setLoading] = useState(false);
    const {toast} = useToast();

    useEffect(() => {
        const fetch = async () => {
            const provider :ProviderModel = await Api.read(`/api/provider/${params.id}`);
            const initialData = {
                name: provider.name || "",
                address: provider.address || "",
                phone: provider.phone || "",
                type: provider.type || ""
            }
            formik.setValues(initialData);
        }
        fetch();
    }, []);

    const formik = useFormik({
        initialValues: {
            name: "",
            address: "",
            phone: "",
            type: ""
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Le nom est obligatoire"),
            address: Yup.string().required("L'adresse est obligatoire"),
            phone: Yup.number().required("Le numero est obligatoire"),
            type: Yup.string().required("Le type est obligatoire"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            const providermodel = new ProviderModel(values.name, values.address, values.phone, values.type);
            const resp = await Api.update(`/api/provider/${params.id}`, providermodel);
            if(resp.ok) {
                toast({
                    title: 'Utilisateur modifié avec succès',
                });
                setLoading(false);
                formik.resetForm();
            } else {
                console.error(resp);
                toast({
                    variant: 'destructive',
                    title: 'Une erreur est survenu lors de la modification',
                    description: 'réessayer'
                });
                setLoading(false);
            }

           // console.log(values)
        }
    })

    return (
        <main className={'my-20 px-20 flex flex-col space-y-10'}>
            <HeadDetaill title={"Editer un utilisateur"} subtitle={"Gestion des utilisateurs"}/>

            <Separator className={'w-full my-5'}/>

            <section  className={"border-4 border-black rounded-3xl flex flex-col space-y-10 py-10 "}>
                <h1 className={"text-4xl font-regular text-center"}>
                    les informations de l'utilisateur
                </h1>
                <form onSubmit={formik.handleSubmit} className={'flex flex-col space-y-5 items-center justify-center '}>
                    <div className={'flex space-x-10 justify-between content-between'}>
                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.name && formik.errors.name ? 'text-red-600' : ''}>{formik.touched.name && formik.errors.name ? formik.errors.name : "Nom complet"}<span
                                className={'text-red-600'}>*</span> </Label>
                            <Input type={'text'}
                                   name={'name'}
                                   value={formik.values.name}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>

                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.address && formik.errors.address ? 'text-red-600' : ''}>{formik.touched.address && formik.errors.address ? formik.errors.address : "Adresse"}<span
                                className={'text-red-600'}>*</span> </Label>
                            <Input type={'text'}
                                   name={'address'}
                                   value={formik.values.address}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>
                    </div>

                    <div className={'flex space-x-10 justify-between content-between'}>
                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.phone && formik.errors.phone ? 'text-red-600' : ''}>{formik.touched.phone && formik.errors.phone ? formik.errors.phone : "Nom de l'article"}<span
                                className={'text-red-600'}>*</span> </Label>
                            <Input type={'tel'}
                                   name={'phone'}
                                   value={formik.values.phone}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>

                        <div className={'flex flex-col space-y-3'}>
                            <Label
                                className={formik.touched.type && formik.errors.type ? 'text-red-600' : ''}>{formik.touched.type && formik.errors.type ? formik.errors.type : "type d'utilisateure"}<span
                                className={'text-red-600'}>*</span> </Label>
                            <Select
                                placeholder=""
                                value={formik.values.type}
                                defaultValue={formik.values.type}
                                onSelect={(value) => {
                                    formik.values.type = String(value)
                                }}
                                options={[
                                    {
                                        label: "Fournisseur",
                                        value: "PROVIDER"
                                    },
                                    {
                                        label: "Livreur",
                                        value: "DELIVER"
                                    }
                                ]}
                                className="bg-white border-none h-[35px] w-[250px]"
                            />
                        </div>
                    </div>

                    <div className={"flex space-x-5 "}>
                        <Button htmlType={"reset"} type={'dashed'} onClick={() => formik.resetForm()}
                                size={'large'} className={'w-auto '}>Effacer</Button>
                        <Button htmlType={"submit"} size={'large'} loading={loading}
                                className={'w-auto bg-black text-white '}>modifier</Button>
                    </div>

                </form>
            </section>


        </main>
    )
}