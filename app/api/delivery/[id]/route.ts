
import {Dto} from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";
import {DeliveryModel} from "@/models/DeliveryModel";

export async function PUT(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const body = await req.json();
        const deliveryModel: DeliveryModel = body;

     

        const dataValidate = Dto.deliveryDto().validate(deliveryModel);
        if (dataValidate.error) {
            return  NextResponse.json({msg: dataValidate.error.message,  status: 422, ok:false });
        }
        else {
             const delivery = await prismadb.delivery.update({
            where: { id: Number(id) },
            data: dataValidate.value
        });

        return NextResponse.json({delivery: delivery, status: 200, ok:true });
        }

       
    } catch (error) {
        console.error('[delivery]', error);
        return  NextResponse.json({msg:`Internal error ${error}`,  status: 500, ok: false });
    }
}

export async function DELETE(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const delivery = await prismadb.delivery.delete({
            where: { id: id }
        });

        return NextResponse.json({delivery: delivery, status: 200, ok:true });
    } catch (error) {
        console.error('[delivery]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok:false });
    }
}

export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const delivery = await prismadb.delivery.findUnique({
            where: { id },
            include: {
                user: true
            }
        });

        return NextResponse.json(delivery);
    } catch (error) {
        console.error('[delivery]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}