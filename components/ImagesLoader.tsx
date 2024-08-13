"use client"

import { UploadButton } from "@/lib/uploadthing";
import { useState, useEffect } from "react";
import Image from "next/image";

const ImageLoader = ({ url, initialUrl }: { url: (url: string) => void, initialUrl?:string }) => {
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        if(initialUrl)
            url(initialUrl)
        setImageUrl(String(initialUrl));
    }, [initialUrl])

    return (
        <div className={`w-[250px] h-[200px] overflow-hidden relative items-center justify-center content-center rounded-2xl border-2`}>

            {
                imageUrl && <Image src={imageUrl} alt="Uploaded Image" layout={'fill'} fill className="objet-cover bg-center bg-cover " />
            }

            <UploadButton
            className="w-full p-3 relative"
                endpoint="imageUploader"
                onClientUploadComplete={(res: any[]) => {
                    // Do something with the response
                    url(res[0].url);
                    setImageUrl(res[0].url);
                    console.log("Files: ", res);
                    alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />
        </div>

    );
}

export default ImageLoader;