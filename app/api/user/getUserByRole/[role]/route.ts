import {Dto} from "@/DTO/Dto";
import { UserModel } from "@/models/UserModel";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";

export async function GET(req: Request, { params  }: { params: {role: string}}) {
    try {
        const role = params.role;
        const user = await prismadb.user.findMany({
            where: {
                role: role,
                isActived: true,
                isVisible: true
            }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('[deleteUser]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}