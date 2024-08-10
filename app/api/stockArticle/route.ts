import { NextResponse } from "next/server";
import { Dto } from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import bcrypt from "bcrypt";
import { StockArticleModel } from "@/models/StockArticleModel";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const stockArticleModel: StockArticleModel = body;

        const dataValidation = Dto.stockArticleDto().validate(stockArticleModel);
        if (dataValidation.error) {
            return  NextResponse.json({msg: dataValidation.error.message,  status: 400, ok:false});
        } else {
            const stockArticle = await prismadb.stockArticle.create({ data: dataValidation.value });
            return NextResponse.json({stockArticle: stockArticle, ok: true});
        }

    } catch (error) {
        console.error('[user_post]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok: false});
    }
}


export async function GET() {
    try {
        const stockArticle = await prismadb.stockArticle.findMany({
            include: {
                product:true,
                stock: {
                    include: {
                        provider: true
                    }
                }
            }
        });
        return NextResponse.json(stockArticle);
    } catch (error) {
        console.error('[getUsers]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}