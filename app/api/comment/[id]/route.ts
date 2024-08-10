
import {Dto} from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";
import {CommentModel} from "@/models/CommentModel";

export async function PUT(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const body = await req.json();
        const commentModel: CommentModel = body;

     

        const dataValidate = Dto.commentDto().validate(commentModel);
        if (dataValidate.error) {
            return  NextResponse.json({msg: dataValidate.error.message,  status: 422, ok:false });
        }
        else {
             const comment = await prismadb.comment.update({
            where: { id: Number(id) },
            data: dataValidate.value
        });

        return NextResponse.json({comment: comment, status: 200, ok:true });
        }

       
    } catch (error) {
        console.error('[comment]', error);
        return  NextResponse.json({msg:`Internal error ${error}`,  status: 500, ok: false });
    }
}

export async function DELETE(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const comment = await prismadb.comment.delete({
            where: { id: id }
        });

        return NextResponse.json({comment: comment, status: 200, ok:true });
    } catch (error) {
        console.error('[comment]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok:false });
    }
}

export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const comment = await prismadb.comment.findUnique({
            where: { id },
            include: {
                user: true
            }
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error('[delivery]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}