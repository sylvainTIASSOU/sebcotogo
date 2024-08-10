import { NextResponse } from "next/server";
import { Dto } from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import bcrypt from "bcrypt";
import { PromotionModel } from "@/models/PromotionModel";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const promotionModel: PromotionModel = body;

        const dataValidation = Dto.promotionDto().validate(promotionModel);
        if (dataValidation.error) {
            return  NextResponse.json({msg: dataValidation.error.message,  status: 400, ok:false});
        } else {
            const promotion = await prismadb.promotion.create({ data: dataValidation.value });
            return NextResponse.json({promotion: promotion, ok: true});
        }

    } catch (error) {
        console.error('[user_post]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok: false});
    }
}


export async function GET() {
    try {
        const promotion = await prismadb.promotion.findMany({
            where: {
                isActived: true,
                isVisible: true
              },
        });
        return NextResponse.json(promotion);
    } catch (error) {
        console.error('[getUsers]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}