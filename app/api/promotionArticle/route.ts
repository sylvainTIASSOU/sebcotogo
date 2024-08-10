import { NextResponse } from "next/server";
import { Dto } from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import { PromotionArticleModel } from "@/models/PromotionArticleModel";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const promotionArticleModel: PromotionArticleModel = body;

        const dataValidation = Dto.promotionArticleDto().validate(promotionArticleModel);
        if (dataValidation.error) {
            return  NextResponse.json({msg: dataValidation.error.message,  status: 400, ok:false});
        } else {
            const promotionArticle = await prismadb.promotionArticle.create({ data: dataValidation.value });
            return NextResponse.json({promotionArticle: promotionArticle, ok: true});
        }

    } catch (error) {
        console.error('[user_post]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok: false});
    }
}


export async function GET() {
    try {
        const promotionArticle = await prismadb.promotionArticle.findMany({
            include: {
                promotion: true,
                product:true,
            }
        });
        return NextResponse.json(promotionArticle);
    } catch (error) {
        console.error('[getUsers]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}