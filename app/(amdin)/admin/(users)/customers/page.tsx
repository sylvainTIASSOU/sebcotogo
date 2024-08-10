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
import {UserModel} from "@/models/UserModel";
import {Api} from "@/app/api/Api";
import SearchInput from "@/app/(amdin)/componnents/SearchInput";

export default function Customers () {
    const [data, setData] = useState<UserModel[]>([]);
    const route = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        Api.read("/api/user/getUserByRole/CUSTOMER").then((values) => {
            setData(values);
        })
    }, []);
    
    const tableConstruction = (datas: any[]) => {

        return datas.map((items) => {

            return   <TableRow key={items.id}>

                <TableCell>{items.firstName}</TableCell>
                <TableCell>{items.lastName}</TableCell>
                <TableCell>{items.phone} </TableCell>
                <TableCell>{items.email}</TableCell>
                {/*actions*/}
                <TableCell className="">
                    <DropdownMenuDemoAdmin childrens={
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Button variant={"outline"}
                                        size={"sm"}
                                        onClick={() => {
                                           // route.push(`/admin/edit_order/${arts.id}`)
                                        }}
                                        className={'self-center w-full'}
                                >
                                    Editer
                                </Button>
                            </DropdownMenuItem>

                            {/*   <DropdownMenuItem>
                                <Button type="button"
                                        variant={'destructive'}
                                        size={'sm'}
                                        onClick={ async () => {

                                        }}
                                >
                                    Désactiver
                                </Button>

                            </DropdownMenuItem>*/}

                        </DropdownMenuGroup>
                    }/>
                </TableCell>
            </TableRow>
        })

    }

    return (
        <div className={'mt-20 px-20 flex flex-col space-y-10'}>

            <div className={'flex justify-between content-between'}>

                <div className={'flex flex-col space-y-0'}>
                    <h1 className={'font-extrabold text-[30px]'}>Clients({data.length})</h1>
                    <p className={'text-gray-400'}>gestion des client</p>
                </div>
            </div>

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
                        <TableHead>Prénom</TableHead>
                        <TableHead className="">Téléphone</TableHead>
                        <TableHead className="">Email</TableHead>
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