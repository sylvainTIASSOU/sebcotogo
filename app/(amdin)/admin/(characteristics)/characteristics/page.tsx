"use client"

import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Separator} from "@/components/ui/separator";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DropdownMenuGroup, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {CharacteristicModel} from "@/models/characteristicModel";
import {DropdownMenuDemoAdmin} from "@/app/(amdin)/componnents/DropDwonMenuAdmin";
import { Api } from "@/app/api/Api";
import HeadList from "@/app/(amdin)/componnents/HeadList";
import SearchInput from "@/app/(amdin)/componnents/SearchInput";
//import Swal from "sweetalert2";


export default  function Characteristics() {
    const route = useRouter()
    const [data, setData] = useState<CharacteristicModel[]>([])
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CharacteristicModel[]>([]);
    const {toast} =  useToast();

    useEffect(() => {
        Api.read('/api/characteristic').then((characteristic) => {
            setData(characteristic);
        })
        
    }, [data]);



  /*  const handleChange = (e: any) => {
        const searchTerm = e.target.value;
        if(searchTerm.trim() !== '') {
            setQuery(searchTerm);
            // Simulation d'une recherche avec un tableau de données statique
            const filteredResults = data.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filteredResults);
        }
        else  {
            setQuery('');
            setResults([]);
        }

    };*/

    const tableConstruction = (data: CharacteristicModel[]) => {
        return  data.map((items) => (
            <TableRow key={items.id}>
                <TableCell>{items.name}</TableCell>
                <TableCell>{items.value}</TableCell>
                {/*actions*/}
                <TableCell className="text-right">
                    <DropdownMenuDemoAdmin childrens={
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Button variant={"outline"}
                                        size={"sm"}
                                        onClick={() => {
                                            route.push(`/admin/edit_characteristic/${items.id}`)
                                        }}
                                        className={'self-center w-full'}
                                >
                                    Edite
                                </Button>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Button type="button"
                                        variant={'destructive'}
                                        className={"w-full"}
                                        size={'sm'}
                                        onClick={async () => {
                                            const confirmation: boolean = confirm("Voulez-vous suprimer cette article?")

                                            if (confirmation) {
                                                const characteristicModel = new CharacteristicModel(items.name, items.value, Number(items.id), false, false);
                                                const resp = await Api.update(`/api/characteristic/${items.id}`, characteristicModel);
                                                if(resp.ok) {
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
        ))
    }


    return (
        <main className={'mt-20 mx-20'}>
            <HeadList title={"Caractéristiques"} subtitle={"gestion des Caractéristiques"} link={"/admin/add_characteristic"} buttonTitle={"Ajouter une Caractéristiques"} count={Number(data.length)} />

           

            <Separator className={'w-full my-5'}/>

            {/*search input*/}
             <SearchInput query={query} setQuery={setQuery} data={data} setResults={setResults} palceholder={"Recherche par nom"} element={"name"}/>


            {/*table*/}
            <Table>
                <TableCaption>Liste des caractéristiques.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Nom du caracteristique</TableHead>
                        <TableHead>value</TableHead>
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