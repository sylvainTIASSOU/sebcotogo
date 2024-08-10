
import {Dto} from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";
import {OrderArticleModel} from "@/models/OrderArticleModel";

export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const orderArticle = await prismadb.orderArticle.findMany({
            where: {
                order: {
                    delivery: {
                        userId: id
                    }
                }
            },
            include: {
                product: true,
                order: {
                    delivery: {
                        user: true
                    }
                },
            }
        });

        return NextResponse.json(orderArticle);
    } catch (error) {
        console.error('[order]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}