
import { NextResponse } from "next/server";
import { Dto } from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import {DeliveryModel} from "@/models/DeliveryModel";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const deliveryModel: DeliveryModel = body;

        const dataValidation = Dto.deliveryDto().validate(deliveryModel);
        if (dataValidation.error) {
            return NextResponse.json({msg: dataValidation.error.message,  status: 400, ok:false});
        } else {
            const delivery = await prismadb.delivery.create({ data: dataValidation.value });
            return NextResponse.json({delivery: delivery, ok: true});
        }

    } catch (error) {
        console.error('[delivery]', error);
        return NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok: false});
    }
}


export async function GET() {
    try {
        const delivery = await prismadb.delivery.findMany({
            
            where: {
                isActived: true,
                isVisible: true
              },
            include: {
                user: true
            }
        });
        return NextResponse.json(delivery);
    } catch (error) {
        console.error('[productCategory]', error);
        return new NextResponse(`Internal error ${error}`, { status: 500 });
    }
}