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

import React, {useEffect, useState} from "react";
import {DropdownMenuDemoAdmin} from "@/app/(amdin)/componnents/DropDwonMenuAdmin";
import {DropdownMenuGroup, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {Search} from "lucide-react";
import {Api} from "@/app/api/Api";
import SearchInput from "@/app/(amdin)/componnents/SearchInput";
import {ProviderModel} from "@/models/ProviderModel";
import HeadList from "@/app/(amdin)/componnents/HeadList";
import Swal from "sweetalert2";

export default function Deliver() {
    const [data, setData] = useState<ProviderModel[]>([]);
    const route = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        Api.read("/api/provider/getProviderByStatus/DELIVER").then((values) => {
            setData(values);
        })
    }, []);

    const tableConstruction = (datas: ProviderModel[]) => {

        return datas.map((items) => {

            return   <TableRow key={items.id}>

                <TableCell>{items.name}</TableCell>
                <TableCell>{items.address}</TableCell>
                <TableCell>{items.phone} </TableCell>
                {/*actions*/}
                <TableCell className="">
                    <DropdownMenuDemoAdmin childrens={
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Button variant={"outline"}
                                        size={"sm"}
                                        onClick={() => {
                                            route.push(`/admin/edit_provider/${items.id}`)
                                        }}
                                        className={'self-center w-full'}
                                >
                                    Editer
                                </Button>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Button type="button"
                                        variant={'destructive'}
                                        className={"w-full"}
                                        size={'sm'}
                                        onClick={ async () => {
                                            Swal.fire({
                                                title: "supression",
                                                text: `Voulez-vous proceder a la supression ?`,
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#3085d6",
                                                cancelButtonColor: "#d33",
                                                confirmButtonText: "Suprimer"
                                            }).then(async (result) => {
                                                if (result.isConfirmed) {
                                                    const providerModel = new ProviderModel(items.name, items.address, items.phone, items.type, Number(items.id), false, false);
                                                    const resp = await Api.update(`/api/provider/${items.id}`, providerModel)

                                                    if(resp.ok) {
                                                        Swal.fire({
                                                            title: "Suprimé!",
                                                            text: "Votre supression a été effectuer.",
                                                            icon: "success"
                                                        });

                                                        setData(data.filter((item) => item.id !== items.id));
                                                        setResults(results.filter((item) => item.id !== items.id));
                                                        route.refresh();
                                                    }
                                                    else {
                                                        console.log(resp);
                                                        Swal.fire({
                                                            title: "Erreur!",
                                                            text: "Un erreur est survenu lors de la supression.",
                                                            icon: "error"
                                                        });
                                                    }

                                                }
                                            });

                                        }}
                                >
                                    Suprimer
                                </Button>

                            </DropdownMenuItem>

                        </DropdownMenuGroup>
                    }/>
                </TableCell>
            </TableRow>
        })

    }

    return (
        <div className={'mt-20 px-20 flex flex-col space-y-10'}>
            <HeadList title={"Livreurs"} subtitle={"Gestion des utilisateurs"} link={"/admin/add_provider"} buttonTitle={"Ajouter un Livreur"} count={data.length} />

            <Separator className={'w-full my-5'}/>

            {/*search input*/}
            {/*search input*/}
            <SearchInput query={query} setQuery={setQuery} data={data} setResults={setResults} palceholder={"Recherche par nom"} element={"name"}/>

            {/*table*/}
            <Table>
                <TableCaption>Liste des clients.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Addresse</TableHead>
                        <TableHead className="">Téléphone</TableHead>
                        <TableHead className="">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        query == '' ? tableConstruction(data) : tableConstruction(results)
                    }
                </TableBody>
                <TableFooter>

                </TableFooter>
            </Table>
        </div>
    )
}