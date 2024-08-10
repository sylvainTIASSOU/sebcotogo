
import {Dto} from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";
import {OrderArticleModel} from "@/models/OrderArticleModel";

export async function PUT(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const body = await req.json();
        const orderarticleModel: OrderArticleModel = body;

        const dataValidate = Dto.orderArticleDto().validate(orderarticleModel);
        if (dataValidate.error) {
            return  NextResponse.json({msg: dataValidate.error.message,  status: 422, ok:false });
        }
        else {
             const orderArticle = await prismadb.orderArticle.update({
            where: { id: Number(id) },
            data: dataValidate.value
        });

        return NextResponse.json({orderArticle: orderArticle, status: 200, ok:true });
        }

       
    } catch (error) {
        console.error('[orderArticle]', error);
        return  NextResponse.json({msg:`Internal error ${error}`,  status: 500, ok: false });
    }
}

export async function DELETE(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const orderArticle = await prismadb.orderArticle.delete({
            where: { id: id }
        });

        return NextResponse.json({orderArticle: orderArticle, status: 200, ok:true });
    } catch (error) {
        console.error('[orderArticle]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok:false });
    }
}

export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const orderArticle = await prismadb.orderArticle.findUnique({
            where: { id },
            include: {
                product: true,
                order: true,
            }
        });

        return NextResponse.json(orderArticle);
    } catch (error) {
        console.error('[order]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}