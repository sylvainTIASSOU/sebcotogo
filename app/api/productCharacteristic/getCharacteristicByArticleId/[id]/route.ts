
import {Dto} from "@/DTO/Dto";
import { CharacteristicModel } from "@/models/characteristicModel";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";
import {CharacteristicArticleModel} from "@/models/CharacteristicArticle";

export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const productCharacteristic = await prismadb.productCharacteristic.findMany({
            where: {
                productId: id
            },
            include: {
                Product: true,
                Characteristic: true,
            }
        });

        return NextResponse.json(productCharacteristic);
    } catch (error) {
        console.error('[characteristic]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}