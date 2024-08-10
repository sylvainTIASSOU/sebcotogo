
import {Dto} from "@/DTO/Dto";
import { CharacteristicModel } from "@/models/characteristicModel";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";
import {CharacteristicArticleModel} from "@/models/CharacteristicArticle";

export async function PUT(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const body = await req.json();
        const characteristicArticleModel: CharacteristicArticleModel = body;

     

        const dataValidate = Dto.productCharacteristic().validate(characteristicArticleModel);
        if (dataValidate.error) {
            return  NextResponse.json({msg: dataValidate.error.message,  status: 422, ok:false });
        }
        else {
             const productCharacteristic = await prismadb.productCharacteristic.update({
            where: { id: Number(id) },
            data: dataValidate.value
        });

        return NextResponse.json({productCharacteristic: productCharacteristic, status: 200, ok:true });
        }

       
    } catch (error) {
        console.error('[productCharacteristic]', error);
        return  NextResponse.json({msg:`Internal error ${error}`,  status: 500, ok: false });
    }
}

export async function DELETE(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const productCharacteristic = await prismadb.productCharacteristic.delete({
            where: { id: id }
        });

        return NextResponse.json({productCharacteristic: productCharacteristic, status: 200, ok:true });
    } catch (error) {
        console.error('[productCharacteristic]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok:false });
    }
}

export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const productCharacteristic = await prismadb.productCharacteristic.findUnique({
            where: { id },
            include: {
                product: true,
                characteristic: true,
            }
        });

        return NextResponse.json(productCharacteristic);
    } catch (error) {
        console.error('[characteristic]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}