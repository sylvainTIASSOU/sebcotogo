
import {Dto} from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";
import {OrderModel} from "@/models/OrderModel";

export async function PUT(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const body = await req.json();
        const orderModel: OrderModel = body;

        const dataValidate = Dto.orderDto().validate(orderModel);
        if (dataValidate.error) {
            return  NextResponse.json({msg: dataValidate.error.message,  status: 422, ok:false });
        }
        else {
             const order = await prismadb.order.update({
            where: { id: Number(id) },
            data: dataValidate.value
        });

        return NextResponse.json({order: order, status: 200, ok:true });
        }

       
    } catch (error) {
        console.error('[order]', error);
        return  NextResponse.json({msg:`Internal error ${error}`,  status: 500, ok: false });
    }
}

export async function DELETE(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const order = await prismadb.order.delete({
            where: { id: id }
        });

        return NextResponse.json({order: order, status: 200, ok:true });
    } catch (error) {
        console.error('[order]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok:false });
    }
}

export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const order = await prismadb.order.findUnique({
            where: { id },
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
        console.error('[order]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}