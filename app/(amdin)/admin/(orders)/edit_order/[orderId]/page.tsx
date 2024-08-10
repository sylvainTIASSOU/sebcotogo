"use client"
import {Separator} from "@/components/ui/separator";
import React, {useEffect, useRef, useState} from "react";

import { useFormik } from "formik";
import {Button} from "@/components/ui/button";
import {DownCircleFilled} from "@ant-design/icons";
import {Label} from "@/components/ui/label";
import {Select} from "antd";
import {useToast} from "@/components/ui/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {OrderModel} from "@/models/OrderModel";
import {useRouter} from "next/navigation"
import {Api} from "@/app/api/Api";



export default function EditOrder({params}: {params: {orderId: string}}) {
    const [order, setOrder] = useState<any>();
    const [orderItems, setOrderItem] = useState<any[]>([]);
    const [userId, setUserId] = useState("");
    const [deliveryId, setDeliveryId] = useState("");
    const [customer, setCustomer] = useState<any>()
    const [delivery, setDeleivery] = useState<any>()
    const { toast } = useToast();
    const refPdf: any = useRef();
    const route = useRouter();

    useEffect(() => {
        Api.read(`/api/order/${params.orderId}`).then((orders: any) => {
            setOrder(orders);
        })

        Api.read(`/api/orderarticle/getArticlesByOrderId/${params.orderId}`).then((ordersitems: any) => {
            setOrderItem(ordersitems);
            console.log(ordersitems)
        })



    }, []);


    const downloadPDF = () => {
        const input: any = refPdf.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const ratio = Math.min(pdfWidth/imgWidth, pdfHeight/imgHeight);
            const  imgX = (pdfWidth - imgWidth * ratio) /2
            const imgY = 30;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth*ratio, imgHeight*ratio);
            pdf.save('order_detail.pdf');
        });
    }

    return (
        <div className={"mt-20 mx-20 mb-10"}>
            <div className={'flex justify-between content-between'}>
                <div className={''}>
                    <h1 className={'font-extrabold text-[30px]'}>Detail du Commande</h1>
                    <h1 className={'text-gray-400'}>gestion du commande</h1>
                </div>

                <Button size={'lg'}
                        className={'flex space-x-3'}
                        onClick={downloadPDF}
                >
                    <DownCircleFilled className={'h-[15px] w-[15px]'}/>
                    <h1>Télépharger les détails</h1>
                </Button>
            </div>

            <Separator className={'w-full'}/>

            <section ref={refPdf}>
                   <div className={"mt-10 w-full grid grid-cols-2 md:grid-cols-3 gap-4 "}>
                    {
                        orderItems.map((items, index) => {
                            return <div key={index}
                                        className={"p-3 flex flex-col shadow-2xl bg-white w-[250px] h-[100px] rounded-md"}>
                                <h1 className={"text-[20px] font-bold"}>{items.product.name} </h1>
                                <h1> prix ttc: {items.price} </h1>
                                <h1> quantité: {items.quantity}</h1>

                            </div>
                        })
                    }
                </div>

                 {/*information*/}
                <div className={"mt-10 p-5 flex justify-between content-between bg-white shadow-md "}>
                    <div className={"w-full"}>
                        <h1 className={"text-xl mb-5 font-bold"}>Informations du client</h1>
                        <table>
                            <tbody>
                            <tr>
                                <td className={"font-bold"}>Nom du client</td>
                                <td> : {order?.delivery.user.firstName} {order?.delivery.user.lastName}</td>
                            </tr>

                            <tr>
                                <td className={"font-bold"}>Email</td>
                                <td> : {order?.delivery.user.email}</td>
                            </tr>
                            <tr>
                                <td className={"font-bold"}>Numéro de téléphone</td>
                                <td> : {order?.delivery.user.phone}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className={"w-full"}>
                        <h1 className={"text-xl mb-5 font-bold"}>Informations de livraison</h1>

                        <table>
                            <tbody>
                            <tr>
                                <td className={"font-bold"}>Ville de livraison</td>
                                <td> : {order?.delivery.city}</td>
                            </tr>

                            <tr>
                                <td className={"font-bold"}>Quartier de livraison</td>
                                <td> : {order?.delivery.quarter}</td>
                            </tr>

                            <tr>
                                <td className={"font-bold"}>Date de livrainson</td>
                                <td> : {order?.delivery.deliveryDate}</td>
                            </tr>

                            <tr>
                                <td className={"font-bold"}>Heure de livraison</td>
                                <td> : {order?.delivery.deliveryHoures}</td>
                            </tr>

                            <tr>
                                <td className={"font-bold"}>Nom de l indique</td>
                                <td> : {order?.delivery.indiqueName}</td>
                            </tr>

                            <tr>
                                <td className={"font-bold"}>Numéro de l indique</td>
                                <td> : {order?.delivery.indiqueNumber}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

            </section>


            <Separator className={"mt-10 w-full"}/>

        </div>
    );
}