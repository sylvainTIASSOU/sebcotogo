"use client"
import {Dialog, Transition} from '@headlessui/react'
import React, {Fragment, useEffect, useState} from 'react'
import {FaSearch} from "react-icons/fa";
import {Api} from "@/api/Api";
import {ArticleModel} from "@/models/ArticleModel";
import Link from "next/link";

interface propsInterface {
    title: string,
    body: React.ReactNode | string,
    button: React.ReactNode | string,


}


export default function Dialogs({color}: { color: string }) {
    let [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ArticleModel[]>([]);
    const [actif, setActif] = useState(false);
    const [articlesData, setArticlesData] = useState<ArticleModel[]>([])

    /*useEffect(()=> {
        Api.getAll('article/all').then((data) => {

            setArticlesData(data)
        })
    }, []) */
    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const handleChange = (e: any) => {
        const searchTerm = e.target.value;
        if (searchTerm.trim() !== '') {
            setActif(true)
            setQuery(searchTerm);
            // Simulation d'une recherche avec un tableau de données statique
            const filteredResults = articlesData.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setResults(filteredResults);
        } else {
            setActif(false)
            setResults([]);
            setQuery("");
        }

    };

    return (
        <>
            <div className="relative inset-0 flex items-center justify-center">
                <button
                    type="button"
                    onClick={openModal}
                    className="rounded-md  text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
                >
                    <FaSearch size={20} color={color} className={'h-[20px] w-[20px] '}/>
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25"/>
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel
                                    className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Trouver un Produit
                                    </Dialog.Title>
                                    <Dialog.Description as={"div"}>
                                        <div className="mt-2">
                                            {/*search par*/}
                                            <div className={'h-[300px]'}>
                                                <div
                                                    className={'flex space-x-2 bg-gray-50 h-[50px] w-auto rounded-[20px] px-3'}>
                                                    <input
                                                        className={' h-9 mt-2 ml-2 bg-gray-50 outline-0 border-0 focus:border-0 focus:outline-0 '}
                                                        placeholder={'Trouver un Produit'}
                                                        type="text"
                                                        value={query}
                                                        onChange={handleChange}

                                                    />

                                                        <FaSearch className={'w-[25px] h-[25px] left-8 top-3 relative'} color={'blue/90'}/>

                                                </div>
                                                <div
                                                    className={`${actif ? 'block bg-gray-50  w-full  p-5 rounded-[20px] h-auto mt-3' : 'hidden'} `}>
                                                    <ul className={"flex flex-col space-y-5"}>
                                                        {results.map((result, index) => (
                                                            <li key={index}>
                                                                <Link
                                                                    className="hover:text-blue-600  hover:pointer font-bold text-[18px]"
                                                                    href={`/products/${result.id}`}>
                                                                    {result.name}
                                                                </Link>

                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                            </div>
                                        </div>
                                    </Dialog.Description>


                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={closeModal}
                                        >
                                            fermer
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
