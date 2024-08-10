'use client'
import { ArticleModel } from "@/models/ArticleModel";
import {Button} from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
interface CardInter {
    articleName: string;
price: number;
id: number;
image: string;
}
const Card2 = ({articleName, price, id, image,}: CardInter) => {
    const route = useRouter();
    return (
        <div
            className={'bg-white shadow-xl rounded-[15px] md:w-[200px] w-[300px]  p-3  h-[300px] md:h-[270px] flex flex-col items-center justify-center'}>
            {/*image*/}
            <Image src={image}
                   alt={""}
                   className={'h-[150px] bg-center object-cover bg-cover'}
                   width={150}
                   height={150}
                   priority={true}
                   quality={100}
            />
            {/*name*/}
            <h1 className={'font-bold mt-2'}>{articleName}</h1>
            {/*price*/}
            <h1 className={'font-medium text-cyan-600'}>{price} TTC</h1>

            {/*button*/}
            <Button variant={'default'} 
                    size={'lg'} 
                    type={'button'} 
                    className={'font-bold bg-buttonColor h[40px] mt-3'}
                    onClick={() => {route.push(`/products/${id}`)}}
                    >
                Ajouter
            </Button>
        </div>

    );
}

export default Card2;