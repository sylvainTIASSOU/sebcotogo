"use client"

import { Input } from "@/components/ui/input";
import Link from "next/link";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logIn } from "@/redux/features/auth-slice";
import {Button} from "antd";
import Image from "next/image";
import {Api} from "@/app/api/Api";
import {LoginModel} from "@/models/LoginModel";
import {useToast} from "@/components/ui/use-toast";

const Login = () => {
    const route = useRouter();
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const { toast } = useToast();
    const formik = useFormik({
        initialValues: {
            phone: "",
            passwords: ""
        },
        validationSchema: Yup.object({
            phone: Yup.number().required('votre numero est obligatoire'),
            passwords: Yup.string().required('le mot de passe est obligatoire')
        }),

        onSubmit: async (values) => {
            setLoading(true)
            const loginModel = new LoginModel(+values.phone, values.passwords)
            const response = await Api.create(`/api/login`, loginModel)
            if(response.ok) {
                const data: any = {
                    uid: response.id,
                    role: response.role,
                    name: response.name,
                }
                dispatch(logIn(data));
                values.passwords = "";
                values.phone = "";
                toast({
                    title: "Connection effectuée"
                })
                if(data.role != "ADMIN") {
                    route.push('/cart');
                } else {
                    route.push('/admin');
                }
                setLoading(false)
            }
            else {
                console.log(response)
                setErrorMessage('Le numéro ou le mot de passe est incorrecte. Réessayez!!!!');

                setLoading(false)
            }

            setLoading(false)
        }

    })
    return (
        <div className=" px-3  h-screen flex w-full items-center justify-center">
            <div className="p-5 bg-white rounded-[15px] w-[500px] flex flex-col space-y-10 items-center justify-center ">

                <Image src={"/icons/logo.svg"} alt={"logo"} width={200} height={200} className={'self-center'} quality={100}/>

                <h1 className="text-[45px] font-bold text-center "> Connectez-vous.</h1>
                <h1 className="text-[18px] font-bold text-center text-red-600 ">{
                    errorMessage != '' ? errorMessage : ''
                }</h1>
                <form onSubmit={formik.handleSubmit} className=" flex flex-col space-y-5">

                    <div className="flex flex-col">
                        <label className={ formik.touched.phone && formik.errors.phone ? "text-[16px] text-red-600 " : "text-[16px] text-gray-600 "}>
                            {
                                formik.touched.phone && formik.errors.phone ? formik.errors.phone : "Numéro de téléphone"
                            }
                        </label>

                        <Input type="tel"
                            className="w-[300px]"
                            name="phone"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                        />
                    </div>
                    {/** password field */}
                    <div className="flex flex-col">
                        <label className={formik.touched.passwords && formik.errors.passwords ?  "text-[16px] text-red-600 " : "text-[16px] text-gray-600 "}>
                            {
                                formik.touched.passwords && formik.errors.passwords ? formik.errors.passwords : "Mot de passe"
                            }
                        </label>

                        <Input type="password"
                            className="w-[300px]"
                            name="passwords"
                            value={formik.values.passwords}
                            onChange={formik.handleChange}

                        />
                    </div>

                    <Button
                        size={"large"}
                        loading={loading}
                        htmlType="submit"
                        className="p-2 w-auto text-white font-bold bg-buttonColor"
                    >
                        Se connecter
                    </Button>
                </form>

                {/**inscription text */}
                <div className="flex flex-col space-y-3">
                    <div className="text-center">Vous n'avez pas un compte? <Link href={"/registre"} className="text-blue-600"> Inscriver-vous!</Link> </div> 
                    <Link className="text-blue-600 text-center" href={"/password_recovery"}>Mot de passe oublié</Link>
                </div>
            </div>
        </div>
    );
}
export default Login;