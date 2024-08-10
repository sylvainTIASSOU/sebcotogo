import { NextResponse } from "next/server";
import { Dto } from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import bcrypt from "bcrypt";
import {StockModel} from "@/models/StockModel";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const stockModel: StockModel = body;

        const dataValidation = Dto.stockDto().validate(stockModel);
        if (dataValidation.error) {
            return  NextResponse.json({msg: dataValidation.error.message,  status: 400, ok:false});
        } else {
            const stock = await prismadb.stock.create({ data: dataValidation.value });
            return NextResponse.json({stock: stock, ok: true});
        }

    } catch (error) {
        console.error('[user_post]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok: false});
    }
}


export async function GET() {
    try {
        const stock = await prismadb.stock.findMany({
            where: {
                isActived: true,
                isVisible: true
              },
            include: {
                provider: true
            }
        });
        return NextResponse.json(stock);
    } catch (error) {
        console.error('[getUsers]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}