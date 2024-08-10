
import { NextResponse } from "next/server";
import { Dto } from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import {OrderModel} from "@/models/OrderModel";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const orderModel: OrderModel = body;

        const dataValidation = Dto.orderDto().validate(orderModel);
        if (dataValidation.error) {
            return NextResponse.json({msg: dataValidation.error.message,  status: 400, ok:false});
        } else {
            const order = await prismadb.order.create({ data: dataValidation.value });
            return NextResponse.json({order: order, ok: true, status: 200});
        }

    } catch (error) {
        console.error('[order]', error);
        return NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok: false});
    }
}


export async function GET() {
    try {
        const order = await prismadb.order.findMany({
            
            where: {
                isActived: true,
                isVisible: true
              },
            include: {
                delivery: {
                    include: {
                        user: true
                    }
                }
            }
        });
        return NextResponse.json(order);
    } catch (error) {
        console.error('[productCategory]', error);
        return new NextResponse(`Internal error ${error}`, { status: 500 });
    }
}