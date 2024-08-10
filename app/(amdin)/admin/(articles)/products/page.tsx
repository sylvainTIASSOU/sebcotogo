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
import {PlusCircle, Search} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Input} from "@/components/ui/input";
import {DropdownMenuGroup, DropdownMenuItem} from "@/components/ui/dropdown-menu";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {ArticleModel} from "@/models/ArticleModel";
import {DropdownMenuDemoAdmin} from "@/app/(amdin)/componnents/DropDwonMenuAdmin";
import {Api} from "@/app/api/Api";
import HeadList from "@/app/(amdin)/componnents/HeadList";
import SearchInput from "@/app/(amdin)/componnents/SearchInput";


export default function Product() {
    const route = useRouter();
    const [data, setData] = useState<ArticleModel[]>([]);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ArticleModel[]>([]);
    const {toast} = useToast();

    useEffect(() => {
        Api.read('/api/article').then((article) => {
            setData(article);
            console.log(article)
        })
    }, []);


    const tableConstruction = (data: ArticleModel[]) => {
        return data.map((items) => (
            <TableRow key={items.id}>
                <TableCell className="font-medium">{items.name}</TableCell>
                <TableCell>{items.price}</TableCell>

                <TableCell>{items.tax}</TableCell>

                {/*actions*/}
                <TableCell className="text-right">
                    <DropdownMenuDemoAdmin childrens={

                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Button variant={"outline"}
                                        size={"sm"}
                                        onClick={() => {
                                            route.push(`/admin/edit_product/${items.id}`)
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
                                        onClick={async () => {
                                            const confirmation: boolean = confirm("Voulez-vous suprimer cette article?")

                                            if (confirmation) {
                                                const articleModel = new ArticleModel(items.name, +items.price, items.description, items.imageUrl, +items.categoryId, items.tax, Number(items.id), false, false);
                                                const resp = await Api.update(`/api/article/${items.id}`, articleModel);

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
        <main className={'mt-20 px-20 flex flex-col sapce-y-10'}>
            <HeadList title={"Articles"} subtitle={"Gestion des articles"} link={"/admin/add_product"} buttonTitle={"Ajouter une Article"} count={data.length} />


            <Separator className={'w-full my-5'}/>

            {/*search input*/}
            <SearchInput query={query} setQuery={setQuery} data={data} setResults={setResults} palceholder={"recherche par nom"} element={"name"} />



            {/*table*/}
            <Table>
                <TableCaption>Liste des Articles.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Nom de l'article</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Taxe</TableHead>
                        <TableHead className="text-right">Action</TableHead>
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
        </main>
    );
}