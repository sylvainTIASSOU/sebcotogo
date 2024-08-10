
import {Dto} from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";
import {OrderModel} from "@/models/OrderModel";


export async function GET(req: Request, { params  }: { params: {status: string}}) {
    try {
        const status = params.status;
        const order = await prismadb.order.findMany({
            where: {
                status: status,
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
        console.error('[order]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}