import {Dto} from "@/DTO/Dto";
import { StockArticleModel } from "@/models/StockArticleModel";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";


export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const stockArticle = await prismadb.stockArticle.findMany({
            where: { productId: id },
            include: {
                product: true,
                stock: {
                    include: {
                        provider: true
                    }
                }
            }
        });

        return NextResponse.json(stockArticle);
    } catch (error) {
        console.error('[deleteUser]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}