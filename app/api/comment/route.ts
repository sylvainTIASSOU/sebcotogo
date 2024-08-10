
import { NextResponse } from "next/server";
import { Dto } from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb"
import {CommentModel} from "@/models/CommentModel";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const commentModel: CommentModel = body;
        const dataValidation = Dto.commentDto().validate(commentModel);
        if (dataValidation.error) {
            return NextResponse.json({msg: dataValidation.error.message,  status: 400, ok:false});
        } else {
            const comment = await prismadb.comment.create({ data: dataValidation.value });
            return NextResponse.json({delivery: comment, ok: true});
        }

    } catch (error) {
        console.error('[comment]', error);
        return NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok: false});
    }
}


export async function GET() {
    try {
        const comment = await prismadb.comment.findMany({
            
            where: {
                isActived: true,
                isVisible: true
              },
            include: {
                user: true
            }
        });
        return NextResponse.json(comment);
    } catch (error) {
        console.error('[comment]', error);
        return new NextResponse(`Internal error ${error}`, { status: 500 });
    }
}