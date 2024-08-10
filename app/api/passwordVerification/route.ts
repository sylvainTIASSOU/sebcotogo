
import {NextResponse} from "next/server";
import bcrypt from "bcrypt";


export async function POST(req: Request) {
    try {
        const { password, passwordExist } = await req.json();

        const com = await bcrypt.compare(
            password,
            passwordExist,
        );
        if(com) {
            return new NextResponse(JSON.stringify({
                ok: true
            }), { status: 200 });
        } else {
            return new NextResponse(JSON.stringify({
                ok: false
            }), { status: 500 });
        }

    }catch (error) {
        console.error('[user_login]', error);
        return new NextResponse('Internal error', {status: 500});
    }
}