"use client"
import { useState } from 'react'
import ImageLoader from "@/components/ImagesLoader";
import Image from "next/image";

const Test = () => {
    const [imageUrl, setImageUrl] = useState<string>('');


    return (
        <div className={'flex items-center justify-center'}>
             <ImageLoader url={setImageUrl} initialUrl={imageUrl} />

             {imageUrl && (
                <Image src={imageUrl} alt="Uploaded Image" width={150} height={150} />
            )}
        </div>
    );
}

export default Test;