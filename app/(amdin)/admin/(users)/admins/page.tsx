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
import {PlusCircle, UserPlus} from "lucide-react";
import {Api} from "@/app/api/Api";
import {UserModel} from "@/models/UserModel";
import SearchInput from "@/app/(amdin)/componnents/SearchInput";

export default function Admin () {
    const [data, setData] = useState<any[]>([]);
    const route = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        Api.read("/api/user/getUserByRole/ADMIN").then((values) => {
            setData(values);
        })
    }, []);


    const tableConstruction = (dataS: UserModel[]) => {

        return dataS.map((arts) => {

            return   <TableRow key={arts.id}>
                <TableCell>{arts.firstName}</TableCell>
                <TableCell>{arts.lastName}</TableCell>
                <TableCell>{arts.phone} </TableCell>
                <TableCell>{arts.email}</TableCell>
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
                    <h1 className={'font-extrabold text-[30px]'}>Admins({data.length})</h1>
                    <p className={'text-gray-400'}>gestion des Admins</p>
                </div>

                <Button size={'lg'}
                        className={'flex space-x-2'}
                        onClick={() => {
                            route.push('/admin/add_user');
                        }}
                >
                    <UserPlus className={'h-[15px] w-[15px]'}/>
                    <h1>Ajouter un utilisateur</h1>
                </Button>
            </div>

            <Separator className={'w-full my-5'}/>

            {/*search input*/}
            <SearchInput query={query} setQuery={setQuery} data={data} setResults={setResults} palceholder={"Recherche par nom"} element={"name"}/>


            {/*table*/}
            <Table>
                <TableCaption>Liste des Admins.</TableCaption>
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