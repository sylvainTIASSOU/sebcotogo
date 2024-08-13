"use client"
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DropdownMenuGroup, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {useRouter} from "next/navigation";
import Swal from "sweetalert2";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import {DropdownMenuDemoAdmin} from "@/app/(amdin)/componnents/DropDwonMenuAdmin";
import {CategoryModel} from "@/models/CategoryModel";
import { Api } from "@/app/api/Api";
import HeadList from "@/app/(amdin)/componnents/HeadList";
import SearchInput from "@/app/(amdin)/componnents/SearchInput";


export default  function Categories() {

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CategoryModel[]>([]);

    const route = useRouter()
    const [data, setData] = useState<CategoryModel[]>([]);
    const {toast} = useToast();
    useEffect(() => {
        Api.read('/api/category').then((cats) => {
            setData(cats);
        })
    }, []);


    const tableConstruction  = (data: CategoryModel[]) => {
       return data.map((items) => (
            <TableRow key={items.id}>
                <TableCell>
                    <Image src={items.imageUrl} alt={""} width={50} height={50} className={"object-cover bg-center"}/>
                </TableCell>
                <TableCell>{items.name}</TableCell>
                {/*actions*/}
                <TableCell className="text-right">
                    <DropdownMenuDemoAdmin childrens={
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Button variant={"outline"}
                                        size={"sm"}
                                        onClick={() => {
                                            route.push(`/admin/edit_category/${items.id}`)
                                        }}
                                        className={'self-center w-full'}
                                >
                                    Edite
                                </Button>
                            </DropdownMenuItem>

                            {/*delete Item*/}
                            <DropdownMenuItem>

                            <Button type="button"
                                        variant={'destructive'}
                                        size={'sm'}
                                    className={"w-full"}
                                        onClick={async () => {
                                            const confirmation: boolean = confirm("Voulez-vous suprimer cette article?")

                                            if (confirmation) {
                                                const categoryModel = new CategoryModel(items.name, items.imageUrl, items.description, items.id, false, false);
                                                const resp = await Api.update(`/api/category/${items.id}`, categoryModel);

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
                                    Suprimé
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

            {/* Same as */}
            <HeadList title={"Categories"} subtitle={"gestion des Categories"} link={"/admin/add_category"} buttonTitle={"Ajouter une Catégorie"} count={Number(data.length)} />
       

            <Separator className={'w-full my-5'}/>

            {/*search input*/}
            <SearchInput query={query} setQuery={setQuery} data={data} setResults={setResults} palceholder={"Recherche par nom"} element={"name"}/>



            {/*table*/}
            <Table>
                <TableCaption>Liste des catégories.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Image</TableHead>
                        <TableHead className="">Nom</TableHead>
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