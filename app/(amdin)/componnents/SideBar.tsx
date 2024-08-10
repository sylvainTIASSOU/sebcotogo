"use client"
import Image from "next/image"
import Link from "next/link";
import {BsFillCartCheckFill} from "react-icons/bs";
import {RiArticleFill, RiDashboard3Fill} from "react-icons/ri";
import {FaUsers} from "react-icons/fa6";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import {MdOutlineSettingsSuggest} from "react-icons/md";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const links = [
    {
        name: "Dashboard",
        url: "/admin",
        icon: <RiDashboard3Fill className="w-[40px] h-[25px] "/>
    },
];
const SideBar = () => {

    const routePath = usePathname();
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            // Mettre à jour la date et l'heure chaque seconde
            setDateTime(new Date());
        }, 1000);

        // Nettoyer l'intervalle lors du démontage du composant
        return () => clearInterval(interval);
        // Récupère le jour du mois (1-31)

        // Récupère les secondes (0-59)
    }, []);


    return (
        <div className=" fixed left-0 h-screen bg-white w-[300px] flex flex-col space-y-3 items-center ">
            {/*logo*/}
            <div className={'mt-[20%] '}>
                <Image src={'/icons/logo.svg'}
                       alt={'logo'}
                       className={'bg-center bg-cover h-[100px] w-[150px] '}
                       width={100}
                       height={100}
                />
            </div>

            {/*items*/}


            <div className={'flex flex-col space-y-5 ml-5 mt-[25%] '}>
                {
                    links.map((items, index) => {
                        return <Link href={items.url}
                                     key={index}
                                     className={` ${routePath == items.url ? 'font-bold text-blue-600 flex space-x-3 text-[18px] hover:text-blue-400  items-center' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-3 items-center'}`}>
                            <div>
                                {items.icon}
                            </div>
                            <h1 className={""}>
                                {items.name}
                            </h1>
                        </Link>
                    })
                }

                {/** utilisateur*/}
                <div className="flex space-x-3  ">
                    <div className="mt-3 hover:font-bold hover:text-blue-600 hover:scale-105">
                        <FaUsers
                            className={routePath == "/admin/admins" || routePath == "/admin/customers" || routePath == "/admin/providers" || routePath == "/admin/delivrers" ? "text-blue-600 flex self-start w-[40px] h-[25px]" : "flex self-start w-[40px] h-[25px]"}/>
                    </div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger
                                className={routePath == "/admin/admins" || routePath == "/admin/customers" || routePath == "/admin/providers" || routePath == "/admin/delivrers" ? "font-bold flex" : "flex hover:font-bold hover:text-blue-600 hover:scale-105 "}>Utilisateur</AccordionTrigger>
                            <AccordionContent className="flex flex-col space-y-3">
                                {/*link1*/}
                                <Link
                                    className={` ${routePath == "/admin/customers" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/customers">
                                    Clients
                                </Link>
                                {/*link2*/}
                                <Link
                                    className={` ${routePath == "/admin/admins" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/admins">
                                    Administrateurs
                                </Link>
                                {/*link3*/}
                                <Link
                                    className={` ${routePath == "/admin/providers" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/providers">
                                    Fournisseurs
                                </Link>
                                {/*link4*/}
                                <Link
                                    className={` ${routePath == "/admin/delivrers" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/delivers">
                                    Livreurs
                                </Link>

                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/** Commandes*/}
                <div className="flex space-x-3  ">
                    <div className="mt-3 hover:font-bold hover:text-blue-600 hover:scale-105">
                        <BsFillCartCheckFill
                            className={routePath == "/admin/orders" || routePath == "/admin/new-orders" || routePath == "/admin/going-orders" || routePath == "/admin/cancel-orders" || routePath == "/admin/faild-orders" ? "text-blue-600 flex self-start w-[40px] h-[25px]" : "flex self-start w-[40px] h-[25px]"}/>
                    </div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger
                                className={routePath == "/admin/orders" || routePath == "/admin/new-orders" || routePath == "/admin/going-orders" || routePath == "/admin/cancel-orders" || routePath == "/admin/faild-orders" ? "font-bold flex" : "flex hover:font-bold hover:text-blue-600 hover:scale-105 "}>
                                Commandes
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col space-y-3">
                                <Link
                                    className={` ${routePath == "/admin/orders" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/orders">
                                    Commandes
                                </Link>
                                {/*link1*/}
                                <Link
                                    className={` ${routePath == "/admin/new-orders" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/new-orders">
                                    Nouvelles commandes
                                </Link>
                                {/*link2*/}
                                <Link
                                    className={` ${routePath == "/admin/going-orders" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/going-orders">
                                    Commandes En Cours de livraisons
                                </Link>
                                {/*link3*/}
                                <Link
                                    className={` ${routePath == "/admin/cancel-orders" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/cancel-orders">
                                    Commandes annulées
                                </Link>
                                {/*link4*/}
                                <Link
                                    className={` ${routePath == "/admin/faild-orders" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/faild-orders">
                                    Commandes Echouées
                                </Link>

                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>


                {/** Products*/}
                <div className="flex space-x-3  ">
                    <div className="mt-3 hover:font-bold hover:text-blue-600 hover:scale-105">
                        <RiArticleFill
                            className={routePath == "/admin/characteristics" || routePath == "/admin/categories" || routePath == "/admin/promotion" || routePath == "/admin/stock" || routePath == "/admin/products" ? "text-blue-600 flex self-start w-[40px] h-[25px]" : "flex self-start w-[40px] h-[25px]"}/>
                    </div>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger
                                className={routePath == "/admin/characteristics" || routePath == "/admin/categories" || routePath == "/admin/promotion" || routePath == "/admin/stock" || routePath == "/admin/products" ? "font-bold flex" : "flex hover:font-bold hover:text-blue-600 hover:scale-105 "}>
                                Articles
                            </AccordionTrigger>
                            <AccordionContent className="flex flex-col space-y-3">
                                <Link
                                    className={` ${routePath == "/admin/stock" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/stock">
                                    stock
                                </Link>


                                <Link
                                    className={` ${routePath == "/admin/characteristics" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/characteristics">
                                    Caracteristique des Articles
                                </Link>
                                {/*link1*/}
                                <Link
                                    className={` ${routePath == "/admin/categories" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/categories">
                                    Catégories d'articles
                                </Link>
                                {/*link2*/}
                                <Link
                                    className={` ${routePath == "/admin/promotion" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/promotion">
                                    Promotion des articles
                                </Link>
                                {/*link3*/}
                                <Link
                                    className={` ${routePath == "/admin/products" ? 'font-bold text-blue-600 flex space-x-5 text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-5'}`}
                                    href="/admin/products">
                                    Articles
                                </Link>

                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                <Link href={"/admin/settings"}
                      className={` ${routePath == "/admin/settings" ? 'font-bold text-blue-600 flex space-x-3 items-center text-[18px] hover:text-blue-400' : 'hover:text-blue-400 text-[15px] text-gray-700 font-regular flex space-x-3 items-center'}`}>
                    <div>
                        <MdOutlineSettingsSuggest className="w-[40px] h-[25px] "/>
                    </div>
                    <h1 className={""}>
                        Parametre
                    </h1>
                </Link>
            </div>

            {/*date and hours*/}

            <div
                className={"absolute bottom-5 text-[20px] flex flex-col space-y-2 items-center text-red-600 font-bold "}>
                <h1>
                    {dateTime.toLocaleDateString()}
                </h1>
                <h1>
                    {dateTime.toLocaleTimeString()}
                </h1>
            </div>

        </div>
    )
}

export default SideBar;