"use client"

import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useToast} from "@/components/ui/use-toast";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {ChevronsRight, Mail, Phone, User} from "lucide-react";
import OrderDoneTable from "@/components/OrderDoneTable";
import OrderGoingTable from "@/components/OrderGoingTable";
import {UserModel} from "@/models/UserModel";
import {Api} from "@/app/api/Api";

interface formData {
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
}
export default function Profil()
{
    const [passConf, setPassConf] = useState('')
    const route = useRouter();
    const { toast } = useToast();
    const [customer, setCustomer] = useState<UserModel>()
    const [activeOld, setActiveOld] = useState(false);
    const [activeNew, setActiveNew] = useState(false);
    const [orders, setOrders] = useState<any[]>([])
    const [ordersDelivered, setOrdersDelivered] = useState<any[]>([])

    const uid = useSelector((state: RootState) => state.auth.value.uid);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cust:UserModel = await Api.read(`/api/user/${uid}`);
                setCustomer(cust)
                const initialValues: formData = {
                    email: cust.email,
                    firstName: cust.firstName,
                    lastName: cust.lastName,
                    phone: String(cust.phone)

                }
                formik.setValues(initialValues);
            }  catch (err) {
                console.error(err)
            }
        }
        fetchData();

        setLoading(true)
        Api.read(`/api/order/getOrderByUserStatus/${uid}/NEW`).then((values: any[]) => {
            setOrders(values)
        });

        Api.read(`/api/order/getOrderByUserStatus/${uid}/DELIVRED`).then((values: any[]) => {
            setOrdersDelivered(values)
        });

        setLoading(false)
    }, []);

    const formikOld = useFormik({
        initialValues: {
            oldPass: ""
        },
        validationSchema: Yup.object({
            oldPass: Yup.string().required("Le mot de passe est requise")
        }),
        onSubmit: async (values) => {
            const resp = await Api.create("/api/passwordVerification", {password: values.oldPass, passwordExist: String(customer?.password)} )
            if(resp.ok) {
                setActiveOld(false)
                setActiveNew(true)
            }
            else {
                toast({
                    title: "Le mot de passe n'existe pas",
                    description: "Reéssayer",
                    variant: "destructive"
                })
            }

        }
    })

    const formikNew = useFormik({
        initialValues: {
            newPass: "",
            newPass2: "",
        },
        validationSchema: Yup.object({
            newPass: Yup.string().required("Le mot de passe est requise"),
            newPass2: Yup.string().required("Le mot de passe est requise")

        }),
        onSubmit: async (values) => {
            if(values.newPass == values.newPass2) {
                const customerModel = new UserModel(Number(customer?.phone), values.newPass, String(customer?.email), String(customer?.firstName), String(customer?.lastName), String(customer?.role))
                const responses = await Api.update(`/api/user/${uid}`, customerModel );
                if(responses.ok) {
                    // TODO:: show toast
                    toast({
                        title: "Mise à jour du mot de passe est effectué avec succès",
                    });
                    setActiveNew(false);
                    setActiveOld(false);
                }
                else {
                    toast({
                        title: "Une erreur est survenue lors de la mise a jours",
                        description: "Réesayer",
                        variant: "destructive"
                    })
                }
            }

        }
    })
    //from validation
    const formik = useFormik({
        initialValues: {
            lastName: "",
            firstName: "",
            email: "",
            phone: "",
        },

        validationSchema: Yup.object({
            lastName: Yup.string().required("Votre nom est obligatoire"),
            firstName: Yup.string().required("Votre prénom est obligatoire"),
            email: Yup.string().email("Entrez un email valide").required("Votre email est obligatoire"),
            phone: Yup.number().required("Votre numéro est obligatoire")

        }),

        onSubmit: async (values) => {


                const customerModel = new UserModel(Number(values.phone), String(customer?.password), values.email, values.firstName, values.lastName, "customer")

                const response = await Api.update(`/api/user/${uid}`, customerModel);
                if(response.ok) {
                    // TODO:: show toast, redirect to login page
                    toast({
                        title: "Mise à jour effectuée avec succès",
                    });
                }
                else {
                    toast({
                        title: "Une erreur est survenue lors de la mise a jours",
                        description: "Réesayer",
                        variant: "destructive"
                    })
                }


        }
    })


    return (<div className={"flex flex-col space-y-10 px-3 mx-3 md:mx-20 mt-20 md:mt-28"}>
            <h1 className={"text-[35px] font-bold"}>Profil</h1>


            <div className="  flex flex-col  ">

                <div className="py-5 px-3 md:px-10 bg-white rounded-[15px] w-full flex flex-col space-y-10  ">

                    <div className={"w-full flex flex-col space-y-10 md:flex-row md:space-x-10"}>
                        {/*informarion*/}
                        <div className="w-full flex flex-col space-y-10">
                            <h1 className="text-[25px] font-medium text-left text-cyan-600 "> Informations
                                personnel </h1>

                            <div
                                className={"flex flex-col space-y-5 md:items-center md:flex-row md:space-y-0 items-centers  md:space-x-5"}>
                                {/*profil image*/}
                                <div className={"w-[150px] h-[150px] rounded-full bg-purple-100"}>

                                </div>

                                {/*profil info*/}
                                <div className={"flex flex-col space-y-5"}>
                                    <div className={"flex space-x-3"}>
                                        <User/>
                                        <h1 className={"text-cyan-600 font-bold "}>{customer?.firstName} {customer?.lastName}</h1>
                                    </div>
                                    <div className={"flex space-x-3"}>
                                        <Phone/> <h1 className={"text-cyan-600 font-bold "}>{customer?.phone}</h1>
                                    </div>
                                    <div className={"flex space-x-3"}>
                                        <Mail/> <h1 className={"text-cyan-600 font-bold "}>{customer?.email}</h1>
                                    </div>
                                </div>
                            </div>

                            <h1 className="text-[25px] font-medium text-left text-cyan-600 ">Editer les
                                Informations </h1>

                            {/*edit form*/}
                            <h1 className={"text-[16px] text-center text-red-600"}>{passConf != "" ? passConf : ""} </h1>
                            <form onSubmit={formik.handleSubmit}
                                  className=" flex flex-col space-y-5 w-full md:w-[400px] ">
                                {/** first form */}
                                <div className="flex space-x-3 content-between justify-between">
                                    <div className="flex flex-col">
                                        <label
                                            className={formik.touched.firstName && formik.errors.firstName ? "text-[16px] text-red-600 " : "text-[16px] text-gray-600 "}>
                                            {formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : "Nom"}
                                        </label>

                                        <Input type="tel"
                                               className="w-full"
                                               value={formik.values.firstName}
                                               onChange={formik.handleChange}
                                               name="firstName"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label
                                            className={formik.touched.lastName && formik.errors.lastName ? "text-[16px] text-red-600 " : "text-[16px] text-gray-600 "}>
                                            {formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : "Prénom"}
                                        </label>

                                        <Input type="tel"
                                               className="w-full"
                                               value={formik.values.lastName}
                                               onChange={formik.handleChange}
                                               name="lastName"
                                        />
                                    </div>

                                </div>
                                {/**number */}
                                <div className="flex flex-col">
                                    <label
                                        className={formik.touched.phone && formik.errors.phone ? "text-[16px] text-red-600" : "text-[16px] text-gray-600 "}>
                                        {formik.touched.phone && formik.errors.phone ? formik.errors.phone : "Numéro de téléphone"}
                                    </label>

                                    <Input type="tel"
                                           className="w-full"
                                           name="phone"
                                           value={formik.values.phone}
                                           onChange={formik.handleChange}
                                           pattern={"[0-9]{8}"}
                                           maxLength={8}
                                    />
                                </div>

                                {/**email */}
                                <div className="flex flex-col">
                                    <label
                                        className={formik.touched.email && formik.errors.email ? "text-[16px] text-red-600" : "text-[16px] text-gray-600 "}>
                                        {formik.touched.email && formik.errors.email ? formik.errors.email : "Email"}
                                    </label>

                                    <Input type="tel"
                                           className="w-full"
                                           name="email"
                                           value={formik.values.email}
                                           onChange={formik.handleChange}
                                    />
                                </div>


                                {/** first form */}

                                <Button
                                    size={"lg"}
                                    variant={"default"}
                                    type="submit"
                                    className="p-2 w-auto bg-buttonColor"
                                >
                                    Mettre à jour
                                </Button>
                            </form>

                            {/*password button*/}
                            <div className={"flex flex-col space-y-5 md:w-[400px]"}>
                                <h1 className={"font-medium text-[25px] text-cyan-600"}>Changer le mot de passe</h1>

                                <Button size={"sm"}
                                        variant={"outline"}
                                        onClick={() => {
                                            setActiveOld(true)
                                        }}
                                        className={"flex space-x-4"}>
                                    <h1>Procédé au changement du mot de passe</h1>

                                    <ChevronsRight/>

                                </Button>
                            </div>

                            {/*form of old password*/}
                            <div className={activeOld ? 'flex md:w-[400px]' : " hidden md:w-[400px]"}>
                                <form onSubmit={formikOld.handleSubmit} className={"flex flex-col space-y-5"}>
                                    <div className={"flex flex-col space-y-1"}>
                                        <label
                                            className={formikOld.touched.oldPass && formikOld.errors.oldPass ? "text-red-600" : ""}>
                                            {formikOld.touched.oldPass && formikOld.errors.oldPass ? formikOld.errors.oldPass : "Entrer l'ancien mot de passe"}
                                            <span className={"text-red-600"}>*</span>
                                        </label>
                                        <Input value={formikOld.values.oldPass}
                                               name="oldPass"
                                               onChange={formikOld.handleChange}
                                               type={"password"} className={"w-full"}
                                        />
                                    </div>
                                    <Button type={"submit"} size={"sm"}
                                            className={"bg-blue-600  text-white"}>Valider</Button>
                                </form>
                            </div>

                            {/*form of new password*/}
                            <div className={activeNew ? 'flex md:w-[400px]' : " hidden md:w-[400px]"}>

                                <form onSubmit={formikNew.handleSubmit} className={"flex flex-col space-y-5"}>
                                    <div className={"flex flex-col space-y-1"}>
                                        <label
                                            className={formikNew.touched.newPass && formikNew.errors.newPass ? "text-red-60" : ""}>
                                            {formikNew.touched.newPass && formikNew.errors.newPass ? formikNew.errors.newPass : "Entrer le Nouveau mot de passe"}
                                            <span className={"text-red-600"}>*</span>
                                        </label>
                                        <Input
                                            value={formikNew.values.newPass}
                                            name={"newPass"}
                                            onChange={formikNew.handleChange}
                                            type={"password"} className={"w-full"}/>
                                    </div>

                                    <div className={"flex flex-col space-y-1"}>
                                        <label
                                            className={formikNew.touched.newPass2 && formikNew.errors.newPass2 ? "text-red-60" : ""}>
                                            {formikNew.touched.newPass2 && formikNew.errors.newPass2 ? formikNew.errors.newPass2 : "Confirmer le nouveau mot de passe"}
                                            <span className={"text-red-600"}>*</span>
                                        </label>
                                        <Input
                                            value={formikNew.values.newPass2}
                                            name={"newPass2"}
                                            onChange={formikNew.handleChange}
                                            type={"password"} className={"w-full"}/>
                                    </div>

                                    <Button type={"submit"} size={"sm"}
                                            className={"bg-blue-600  text-white"}>Valider</Button>
                                </form>
                            </div>

                        </div>

                        {/*oder delivered */}
                        <div className={"w-full"}>
                            <h1 className={"font-medium text-[25px] mb-5 text-cyan-600"}>Historique des commendes passées</h1>
                            <OrderGoingTable data={ordersDelivered}/>
                        </div>
                    </div>

                    {/*historique*/}
                    <div className={"flex flex-col space-y-5 "}>
                        <h1 className={"font-medium text-[25px] mb-5 text-cyan-600"}>Historique des livraisons reçus</h1>

                        <OrderGoingTable data={orders}/>
                    </div>
                </div>
            </div>
        </div>
    );
}