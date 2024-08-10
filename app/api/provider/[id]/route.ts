import {Dto} from "@/DTO/Dto";
import { ProviderModel } from "@/models/ProviderModel";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";

export async function PUT(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const body = await req.json();
        const providerModel: ProviderModel = body;

     

        const dataValidate = Dto.providerDto().validate(providerModel);
        if (dataValidate.error) {
            return  NextResponse.json({msg: dataValidate.error.message,  status: 422, ok:false });
        }
        else {
             const provider = await prismadb.provider.update({
            where: { id: Number(id) },
            data: dataValidate.value
        });

        return NextResponse.json({provider: provider, status: 200, ok:true });
        }

       
    } catch (error) {
        console.error('[stock]', error);
        return  NextResponse.json({msg:`Internal error ${error}`,  status: 500, ok: false });
    }
}

export async function DELETE(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const provider = await prismadb.provider.delete({
            where: { id: id }
        });

        return NextResponse.json({provider: provider, status: 200, ok:true });
    } catch (error) {
        console.error('[deleteUser]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500, ok:false });
    }
}

export async function GET(req: Request, { params  }: { params: {id: string}}) {
    try {
        const id = Number(params.id);
        const provider = await prismadb.provider.findUnique({
            where: { id }
        });

        return NextResponse.json(provider);
    } catch (error) {
        console.error('[deleteUser]', error);
        return  NextResponse.json({msg: `Internal error ${error}`,  status: 500 });
    }
}