import {Dto} from "@/DTO/Dto";
import { ArticleModel } from "@/models/ArticleModel";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";

export async function GET(req: Request, { params  }: { params: {name: string}}) {
    try {
        const name = params.name;
        const products = await prismadb.product.findMany({
            where: {
                ProductCategories: {
                    name: name,
                },
            },
            include: {
                ProductCategories: true, // Optionnel : inclure les détails de la catégorie
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('[product]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}