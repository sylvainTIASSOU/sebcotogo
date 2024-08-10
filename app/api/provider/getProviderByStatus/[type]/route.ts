import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";


export async function GET(req: Request, { params  }: { params: {type: string}}) {
    try {
        const type = params.type;
        const provider = await prismadb.provider.findMany({
            where: {
                type: type,
                isActived: true,
                isVisible: true
             }
        });

        return NextResponse.json(provider);
    } catch (error) {
        console.error('[deleteUser]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}