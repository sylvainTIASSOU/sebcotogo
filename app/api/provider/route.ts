import { NextResponse } from "next/server";
import { Dto } from "@/DTO/Dto";
import prismadb from "@/prisma/prismadb";
import { ProviderModel } from "@/models/ProviderModel";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const providerModel: ProviderModel = body;

        const dataValidation = Dto.providerDto().validate(providerModel);
        if (dataValidation.error) {
            return  NextResponse.json({msg: dataValidation.error.message,  status: 400, ok:false});
        } else {
            const provider = await prismadb.provider.create({ data: dataValidation.value });
            return NextResponse.json({provider: provider, ok: true});
        }

    } catch (error) {
        console.error('[user_post]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok: false});
    }
}


export async function GET() {
    try {
        const provider = await prismadb.provider.findMany({
            where: {
                isActived: true,
                isVisible: true
              },
        });
        return NextResponse.json(provider);
    } catch (error) {
        console.error('[getUsers]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}