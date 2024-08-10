"use client"
import { Separator } from "@/components/ui/separator";
import React, {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import * as Yup from "yup"
import { useFormik } from "formik";
import {useRouter} from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "antd";
import {CharacteristicModel} from "@/models/characteristicModel";
import {ArrowLeftCircle} from "lucide-react";
import {Api} from "@/app/api/Api";
import HeadDetaill from "@/app/(amdin)/componnents/HeadDetail";

export default  function EditCategory({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(false);
    const route = useRouter();
    const [characteristicData, setCharacteristicData] = useState<CharacteristicModel>()
    const { toast } = useToast()

    useEffect(() => {
        const fetch = async () => {
            // @ts-ignore
            const resp: CharacteristicModel = await Api.read(`/api/characteristic/${params.id}`);
            setCharacteristicData(resp);
            const initialData = {
                name: resp.name || "",
                value: resp.value || ""
            }
            await formik.setValues(initialData);
        }
        fetch();
       }, [])

    function resetForm(values: any)  {
        values.name= "";
        values.value= "";
    }

    const formik = useFormik({
        initialValues: {
            name:  "",
            value: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Le nom est obligatoire"),
            value: Yup.string().required("La valeur est obligatoire"),
        }),
        onSubmit: async (values) => {
           setLoading(true)
            const characteristicModel = new CharacteristicModel(values.name, values.value);
            
            const response = await Api.update(`/api/characteristic/${params.id}`, characteristicModel )
            
           if(response.ok) {
                //show toast
                toast({
                    title: "Caracteristique Modifier avec succès",
                    description: "Une caractéristique a été modifier",
                })
                resetForm(values);
            }
            else
            {
                //show erro toast
                toast({
                    variant: 'destructive',
                    title: "Une erreur s'est produite lors de la modification ",
                    description: "Réessayer!!!",
                });
                setLoading(false)
            }
            setLoading(false);
        }
    })
    return (
        <main className={'mt-20 mx-20 flex flex-col space-y-10'}>

            <HeadDetaill title={"Ajouter une Categorie"} subtitle={"Gestion des Categories"} />


            <Separator className={'w-full'}/>

            <section>
                <form onSubmit={formik.handleSubmit} className={'flex flex-col space-y-3 w-[950px]'}>
                    {/*image*/}

                    {/*first input row*/}
                    <div className={'flex mt-5 space-x-20'}>
                        <div className={'flex flex-col space-y-2'}>
                            <Label
                                className={formik.touched.name && formik.errors.name ? 'text-red-600' : ''}>{formik.touched.name && formik.errors.name ? formik.errors.name : "Nom du Caractéristique"}<span
                                className={'text-red-600'}>*</span> </Label>
                            <Input type={'text'}
                                   name={'name'}
                                   value={formik.values.name}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>

                        <div className={'flex flex-col space-y-2'}>
                            <Label
                                className={formik.touched.value && formik.errors.value ? 'text-red-600' : ''}>{formik.touched.value && formik.errors.value ? formik.errors.value : "valeur"}<span
                                className={'text-red-600'}>*</span> </Label>
                            <Input type={'text'}
                                   name={'value'}
                                   value={formik.values.value}
                                   onChange={formik.handleChange}
                                   className={'bg-white border-none h-[35px] w-[250px]'}/>
                        </div>


                    </div>

                    <div className={"flex space-x-5 relative top-14"}>
                        <Button htmlType={"button"} type={'dashed'} onClick={() => resetForm(formik.values)}
                                size={'large'} className={'w-auto '}>Effacer</Button>
                        <Button htmlType={"submit"} size={'large'} className={'w-auto bg-black text-white '}>Modifier</Button>
                    </div>
                </form>
            </section>
        </main>
    );
}