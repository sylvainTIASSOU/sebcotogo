import {Dto} from "@/DTO/Dto";
import { UserModel } from "@/models/UserModel";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";

export async function PUT(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const body = await req.json();
        const userModel: UserModel = body;

     

        const dataValidate = Dto.userDto().validate(userModel);
        if (dataValidate.error) {
            return  NextResponse.json({msg: dataValidate.error.message,  status: 422, ok:false });
        }
        else {
             const user = await prismadb.user.update({
            where: { id: Number(id) },
            data: dataValidate.value
        });

        return NextResponse.json({user: user, status: 200, ok:true });
        }

       
    } catch (error) {
        console.error('[updateUser]', error);
        return  NextResponse.json({msg:`Internal error ${error}`,  status: 500, ok: false });
    }
}

export async function DELETE(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const user = await prismadb.user.delete({
            where: { id: id }
        });

        return NextResponse.json({user: user, status: 200, ok:true });
    } catch (error) {
        console.error('[deleteUser]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok:false });
    }
}

export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const user = await prismadb.user.findUnique({
            where: { id }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[deleteUser]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}