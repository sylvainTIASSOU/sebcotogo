"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Select} from "antd";
import {Api} from "@/app/api/Api";
import Swal from "sweetalert2";
import {OrderModel} from "@/models/OrderModel";


const OrderComp = ({status}: {status: string}) => {
    const route = useRouter();
    const [query, setQuery] = useState('');
    const [statusQuery, setStatusQuery] = useState('');
    const [userQuery, setuserQuery] = useState('');
    const [data, setData] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([]);

    useEffect(() => {
        Api.read(`/api/order/getOrderByStatus/${status}`).then((items: any[]) => {
            setData(items);
            console.log(items)
            setFilteredData(items);
        });
    }, []);

    useEffect(() => {
        const filteredResults = data.filter(item => {
            const matchesCity = item.createdAt.slice(0, 10).toString().toLowerCase().includes(query.toLowerCase());
            const matchesUser = item.delivery.user.firstName.toLowerCase().includes(userQuery.toLowerCase());
            const matchesStatus = statusQuery ? item.status === statusQuery : true;
            return matchesCity && matchesStatus && matchesUser;
        });
        setFilteredData(filteredResults);
    }, [query, statusQuery, data, userQuery]);

    const handleCitySearch = (e: any) => {
        setQuery(e.target.value);
    };
    const handleUserSearch = (e: any) => {
        setuserQuery(e.target.value);
    };

    const handleStatusSearch = (value: any) => {
        setStatusQuery(value);
    };

    const tableConstruction = (data: any[]) => {
        return data.map((items) => (
            <TableRow key={items.id}>
                <TableCell>{String(items.delivery.user.firstName)}</TableCell>
                <TableCell>{String(items.createdAt).slice(0, 10)}</TableCell>
                <TableCell>{items.totalPrice}</TableCell>
                <TableCell>{items.delivery.city} {items.delivery.quarter}</TableCell>
                <TableCell>{items.delivery.deliveryDate}</TableCell>
                <TableCell>{items.delivery.deliveryHoures}</TableCell>
                <TableCell
                    className={ "bg-lime-600"}>
                    <Select
                        placeholder={""}
                        defaultValue={items.status}
                        onSelect={async (value) => {
                            Swal.fire({
                                title: "Modification",
                                text: `Voulez-vous modifiez le status de cette commande ?`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                confirmButtonText: "Modifier"
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    const orderModel = new OrderModel(items.totalPrice, value, items.payement, +items.amount, +items.deliveryId, +items.id);
                                    const resp = await Api.update(`/api/order/${items.id}`, orderModel);
                                    if (resp.ok) {
                                        Swal.fire({
                                            title: "Modification!",
                                            text: " Modification effectuée.",
                                            icon: "success"
                                        });

                                        setData(data.filter((item) => item.id !== items.id));
                                        route.refresh();
                                    }
                                }
                            });
                        }}
                        options={[
                            {label: "Nouvelle", value: "NEW"},
                            {label: "Delivrée", value: "DELIVRED"},
                            {label: "En cours de livraison", value: "INDELIVERED"},
                            {label: "En attente", value: "GOING"},
                            {label: "Annulée", value: "CANCEL"},
                            {label: "En attente de stock", value: "INSTOCK"},
                            {label: "Échouée", value: "FAILD"},
                        ]}
                        className="bg-white border-none h-[35px] w-[250px]"
                    />
                </TableCell>
                <TableCell className="">
                    <Button variant={"outline"} size={"sm"} onClick={() => route.push(`/admin/edit_order/${items.id}`)}
                            className={'self-center w-full'}>
                        Éditer
                    </Button>
                </TableCell>
            </TableRow>
        ));
    };

    return (

        <main className={'mt-20 px-20 flex flex-col space-y-10'}>
            <div className={'flex justify-between content-between'}>
                <div className={'flex flex-col space-y-0'}>
                    <h1 className={'font-regular text-[30px]'}>Commandes ({filteredData.length})</h1>

                </div>
            </div>
            <Separator className={'w-full my-5'}/>

            <div className={"grid grid-cols-1 md:grid-cols-3 gap-4"}>
                <div className="flex items-center justify-center my-5">
                    <div className="flex space-x-3 items-center">
                        <Input type={"text"} className=" w-[250px] bg-white" placeholder={"Recherche par nom du cleint"}
                               value={userQuery}
                               onChange={handleUserSearch}/>
                    </div>
                </div>

                <div className="flex items-center justify-center my-5">
                    <div className="flex space-x-3 items-center">
                        <Input type={"date"} className=" w-[250px] bg-white"
                               placeholder={"Recherche par date de la commande"} value={query}
                               onChange={handleCitySearch}/>
                    </div>
                </div>
                <div className="flex items-center justify-center my-5">
                    <div className="flex space-x-3 items-center">
                        <Select
                            placeholder={"Recherche par statut"}
                            onSelect={handleStatusSearch}
                            options={[
                                {label: "Nouvelle", value: "NEW"},
                                {label: "Delivrée", value: "DELIVRED"},
                                {label: "En cours de livraison", value: "INDELIVERED"},
                                {label: "En attente", value: "GOING"},
                                {label: "Annulée", value: "CANCEL"},
                                {label: "En attente de stock", value: "INSTOCK"},
                                {label: "Échouée", value: "FAILD"},
                            ]}
                            className="bg-white border-none  w-[250px]"
                        />
                    </div>
                </div>
            </div>


            <Table>
                <TableCaption>Liste des Commandes.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Date de la commande</TableHead>
                        <TableHead>Prix total</TableHead>
                        <TableHead>Adresse de livraison</TableHead>
                        <TableHead>Date de livraison</TableHead>
                        <TableHead>Heure de livraison</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableConstruction(filteredData)}
                </TableBody>
                <TableFooter></TableFooter>
            </Table>
        </main>
    );
}
export default OrderComp;