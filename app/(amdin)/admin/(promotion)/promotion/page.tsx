"use client"
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DropdownMenuGroup, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import {DropdownMenuDemoAdmin} from "@/app/(amdin)/componnents/DropDwonMenuAdmin";
import { Api } from "@/app/api/Api";
import HeadList from "@/app/(amdin)/componnents/HeadList";
import SearchInput from "@/app/(amdin)/componnents/SearchInput";
import {CategoryModel} from "@/models/CategoryModel";


export default  function Promotion() {

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const route = useRouter()
    const [data, setData] = useState<any[]>([]);
    const {toast} = useToast();
    useEffect(() => {
        Api.read('/api/promotionArticle').then((cats) => {
            setData(cats);
            console.log(cats)
        })
    }, []);

    const tableConstruction = (data: any[]) => {
        const currentDate = new Date();

        return data.map((items) => {
            const endDate = new Date(items.promotion.endDate);
            const isExpired = endDate < currentDate;

            return (
                <TableRow key={items.id} className={isExpired ? 'bg-red-200' : ''}>
                    <TableCell> {items.product.name} </TableCell>
                    <TableCell> {items.oldPrice} </TableCell>
                    <TableCell>{items.newPrice}</TableCell>
                    <TableCell> {items.promotion.beginDate} </TableCell>
                    <TableCell> {items.promotion.endDate} </TableCell>
                    <TableCell className="text-right">
                        <DropdownMenuDemoAdmin childrens={
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Button variant={"outline"}
                                            size={"sm"}
                                            onClick={() => {
                                                route.push(`/admin/edit_promotion/${items.id}`)
                                            }}
                                            className={'self-center w-full'}
                                    >
                                        Edite
                                    </Button>
                                </DropdownMenuItem>

                                  <DropdownMenuItem>
                                    <Button type="button"
                                            variant={'destructive'}
                                            size={'sm'}
                                            className={"w-full"}
                                            onClick={async () => {
                                                const confirmation: boolean = confirm("Voulez-vous suprimer cette article?")

                                                if (confirmation) {
                                                    const resp = await Api.delete(`/api/promotionArticle/${items.id}`);

                                                    if (resp.ok){
                                                        toast({
                                                            title: "Supression effectuée"
                                                        });
                                                        setData(data.filter((item) => item.id !== items.id));
                                                        setResults(results.filter((item) => item.id !== items.id));
                                                        route.refresh();
                                                    } else {
                                                        console.error(resp)
                                                        toast({
                                                            title: "Une erreur est survenue lors de la supression",
                                                            variant: "destructive"
                                                        });
                                                    }
                                                }
                                            }}
                                    >
                                        Suprimer
                                    </Button>
                                </DropdownMenuItem>

                            </DropdownMenuGroup>
                        }/>
                    </TableCell>
                </TableRow>
            )
        });
    }

    return (
        <main className={'mt-20 mx-20'}>

            {/* Same as */}
            <HeadList title={"Promotions"} subtitle={"Gestion des promotion"} link={"/admin/add_promotion"} buttonTitle={"Ajouter une promotion"} count={Number(data.length)} />
       

            <Separator className={'w-full my-5'}/>

            {/*search input*/}
            <SearchInput query={query} setQuery={setQuery} data={data} setResults={setResults} palceholder={"Recherche par nom"} element={"name"}/>



            {/*table*/}
            <Table>
                <TableCaption>Liste des catégories.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Nom de l'article</TableHead>
                        <TableHead className="">Encient prix</TableHead>
                        <TableHead className="">Nouveau prix</TableHead>
                        <TableHead className="">Date de debut</TableHead>
                        <TableHead className="">Date de fin</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                {/*table body*/}
                <TableBody>
                    {
                        query == '' ? tableConstruction(data) : tableConstruction(results)
                    }
                </TableBody>
                </Table>
        </main>
    );
}