import {Dto} from "@/DTO/Dto";
import { ArticleModel } from "@/models/ArticleModel";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";

export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const products = await prismadb.product.findMany({
            where: { categoryId: id },

        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('[product]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}