"use client"
import {useFormik} from "formik";
import * as Yup from 'yup';
import {Input} from "@/components/ui/input";
import {Separator} from "@/components/ui/separator";
import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {DeliveryModel} from "@/models/DeliveryModel";
import {useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useKKiaPay} from 'kkiapay-react';
import CartModel from "@/models/CartModel";
import {OrderModel} from "@/models/OrderModel";
import {OrderArticleModel} from "@/models/OrderArticleModel";
import {remove, removeProduct} from "@/redux/features/cart-slice";
import {Button} from "antd";
import {UserModel} from "@/models/UserModel";
import {Api} from "@/app/api/Api";

const Order = () => {

    const isAuth = useSelector((state: RootState) => state.auth.value.isAuth)
    const uid = useSelector((state: RootState) => state.auth.value.uid)
    const {toast} = useToast();
    const itemCart: CartModel[] = useSelector((state: RootState) => state.cart.items);
    const [total, setTotal] = useState(0)
    const route = useRouter()
    const {
        openKkiapayWidget, addKkiapayListener, removeKkiapayListener
    } = useKKiaPay();
    const [customer, setCustomer] = useState<UserModel>()
    const dispatch = useDispatch();
    const [orderId, setOrder] = useState("");
    const [deliveryId, setDeliveryId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [responses, setResponse] = useState(false);


    //fonction if paiement if donne succefulley
    async function successHandler(response: any) {
        setIsLoading(true);
        const orderModel = new OrderModel(total, "NEW", "PAY", total, Number(deliveryId));
        const resp1 = await Api.create('/api/order', orderModel,);
        if (resp1.ok) {
            const orderId = resp1.order.id;
            setOrder(resp1.order.id);

            for (const ele of itemCart) {
                const orderArticle = new OrderArticleModel(ele.quantity, ele.price, Number(ele.id), orderId);
                await Api.create("/api/orderarticle" ,orderArticle)
            }
            dispatch(remove())

            await fetch(`/api/send`, {
                //mode: 'no-cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: String(customer?.email)}),
            }).then((val) => {

                if (val.ok) {
                    toast({
                        title: "Commandee passé  avec succès!",
                        description: "Une  emaill  vous a été destiner!"
                    });

                    route.push(`/congratulation/${orderId}`)

                }
            });
        } else {
            console.log(resp1)
            setIsLoading(false)
        }

    }

    function failureHandler(error: any) {

        toast({
            title: "Une erreur est survenue lors du paiement!",
            variant: "destructive"
        })
        setIsLoading(false)
    }
    useEffect(() => {
        if (deliveryId != "") {
            //open payement dialog
            setIsLoading(true)
            open();
        }
        setTotal(itemCart.reduce((totals, cartModel) => totals + cartModel.priceTotal, 0));
        Api.read(`/api/user/${uid}`).then((custom: any) => {
            setCustomer(custom)
        });

        addKkiapayListener('success', successHandler)
        addKkiapayListener('failed', failureHandler)

        return () => {
            removeKkiapayListener('success')//,successHandler
            removeKkiapayListener('failed')//, failureHandler
        };
    }, [addKkiapayListener, removeKkiapayListener, deliveryId]);

    function open() {
        openKkiapayWidget({
            amount: total,
            fullname: `${customer?.lastName} ${customer?.firstName}`,
            api_key: process.env.KKIAPAY_API_SANDBOX,
            sandbox: true,
            email: `${customer?.email}`,
            phone: "97000000",
        });
    }

    const formik = useFormik({

        initialValues: {
            city: "",
            quarter: "",
            deliveryDate: "",
            deliveryHoures: "",
            codePromo: "",
            indiqueName: "",
            indiqueNumber: ""
        },
        validationSchema: Yup.object({
            city: Yup.string().required('La vile est obligatoire'),
            quarter: Yup.string().required('Le quartier est obligatoire'),
            deliveryDate: Yup.string().required('la date de livraison est obligatoire'),
            deliveryHoures: Yup.string().notRequired(),
            codePromo: Yup.string().notRequired(),
            indiqueName: Yup.string().required('Le nom de l indique est obligatoire'),
            indiqueNumber: Yup.string().required('Le numéro de l indique est obligatoire'),
        }),
        onSubmit: async (values) => {
            setIsLoading(true)
            if (isAuth) {
                const deliveryModel = new DeliveryModel(values.city, values.quarter, values.deliveryDate, values.deliveryHoures, values.indiqueName, Number(values.indiqueNumber), +uid, values.codePromo);
                const resp = await Api.create(`/api/delivery`, deliveryModel );
                if (resp.ok) {
                    setDeliveryId(resp.delivery.id);

                } else {
                    console.log(resp);
                    toast({
                        title: "Une erreur est rencomtrer lors de l'enregistrement",
                        variant: "destructive",
                        description: "réessayer!!"
                    })
                    setIsLoading(false)
                }
            }

        }
    })
    return (
        <div className=" mt-[35%] h-full md:mt-[10%] px-3 md:px-20 flex flex-col items-center justify-center">
            <div
                className="bg-white rounded-[15px] p-3 w-full md:w-[800px] flex flex-col md:flex-row  items-center justify-center h-auto ">
                <div className="flex flex-col w-full">
                    <h1 className={isLoading? "text-[25px] text-yellow-500 font-medium text-center my-5 ": "text-[30px] font-medium text-center my-5 "}>{isLoading ? "Opération de paiement en cours ...." :  "Formulaire de livraison."}</h1>
                    {/**image */}
                    <div className="w-full h-full ">
                        <Image src={'/images/sammy-man-and-dog-delivering-packages-on-a-moped.gif'}
                               alt="gift"
                               width={200}
                               height={200}
                               className="w-full h-full bg-cover bg-center bg-content"
                        />
                    </div>
                </div>


                <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-5 w-full ">
                    <div className="flex flex-row space-x-5 w-full">

                        <div className="flex flex-col space-y-3">


                            <div className="flex space-x-4">

                                {/** city input */}
                                <div className="flex flex-col space-y-1">
                                    <label className={formik.touched.city && formik.errors.city ? "text-red-600" : ""}>{
                                        formik.touched.city && formik.errors.city ? formik.errors.city : "Ville"
                                    } <span className="text-red-600">*</span> </label>
                                    <Input type="text"
                                           value={formik.values.city}
                                           onChange={formik.handleChange}
                                           name="city"
                                           className=""/>
                                </div>

                                {/** quarterquarter input */}
                                <div className="flex flex-col space-y-1">
                                    <label
                                        className={formik.touched.quarter && formik.errors.quarter ? "text-red-600" : ""}>{
                                        formik.touched.quarter && formik.errors.quarter ? formik.errors.quarter : "Quartier"
                                    }<span className="text-red-600">*</span> </label>
                                    <Input type="text"
                                           value={formik.values.quarter}
                                           onChange={formik.handleChange}
                                           name="quarter"
                                           className=""/>
                                </div>
                            </div>


                            <div className="flex space-x-4">
                                {/** date input */}
                                <div className="flex flex-col space-y-1">
                                    <label
                                        className={formik.touched.deliveryDate && formik.errors.deliveryDate ? "text-red-600" : ""}>{
                                        formik.touched.deliveryDate && formik.errors.deliveryDate ? formik.errors.deliveryDate : "Date de livraison souhaité"
                                    }<span className="text-red-600">*</span> </label>
                                    <Input type="date"
                                           value={formik.values.deliveryDate}
                                           onChange={formik.handleChange}
                                           name="deliveryDate"
                                           className=""/>
                                </div>

                                {/** houres input */}
                                <div className="flex flex-col space-y-1">
                                    <label
                                        className={formik.touched.deliveryHoures && formik.errors.deliveryHoures ? "text-red-600" : ""}>{
                                        formik.touched.deliveryHoures && formik.errors.deliveryHoures ? formik.errors.deliveryHoures : "Heure de livraison souhaité"
                                    } </label>
                                    <Input type="time"
                                           value={formik.values.deliveryHoures}
                                           onChange={formik.handleChange}
                                           name="deliveryHoures"
                                           className=""/>
                                </div>
                            </div>

                            <Separator orientation="horizontal" className="my-5"/>

                            {/** indique name input */}
                            <div className="flex flex-col space-y-1">
                                <label
                                    className={formik.touched.indiqueName && formik.errors.indiqueName ? "text-red-600" : ""}>{
                                    formik.touched.indiqueName && formik.errors.indiqueName ? formik.errors.indiqueName : "Nom et prénom d'un indique"
                                }<span className="text-red-600">*</span> </label>
                                <Input type="text"
                                       value={formik.values.indiqueName}
                                       onChange={formik.handleChange}
                                       name="indiqueName"
                                       className=""/>
                            </div>

                            {/** indique number input */}
                            <div className="flex flex-col space-y-1">
                                <label
                                    className={formik.touched.indiqueNumber && formik.errors.indiqueNumber ? "text-red-600" : ""}>{
                                    formik.touched.indiqueNumber && formik.errors.indiqueNumber ? formik.errors.indiqueNumber : "Numéro de l'indique indique"
                                }<span className="text-red-600">*</span> </label>
                                <Input type="tel"
                                       value={formik.values.indiqueNumber}
                                       onChange={formik.handleChange}
                                       name="indiqueNumber"
                                       pattern={"[0-9]{8}"}
                                       maxLength={8}
                                       className=""/>
                            </div>

                            {/** code  promo input */}
                            <div className="flex flex-col space-y-1">
                                <label
                                    className={formik.touched.codePromo && formik.errors.codePromo ? "text-red-600" : ""}>{
                                    formik.touched.codePromo && formik.errors.codePromo ? formik.errors.codePromo : "Votre code promo"
                                }<span className="text-red-600"></span> </label>
                                <Input type="text"
                                       value={formik.values.codePromo}
                                       onChange={formik.handleChange}
                                       name="codePromo"
                                       className=""/>
                            </div>
                        </div>


                    </div>


                    <Button htmlType="submit" loading={isLoading} className="bg-buttonColor self-center md:self-end">
                        Passer A la caisse
                    </Button>
                </form>

            </div>
        </div>
    );
}
export default Order;