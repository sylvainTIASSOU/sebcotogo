import {UserModel} from "@/models/UserModel";
import prismadb from "@/prisma/prismadb";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        const user: UserModel[] = await prismadb.user.findMany({
            where:
                { phone: phone }
        });
        // Vérification de l'existence de l'utilisateur et de la correspondance du mot de passe
        // Vérification de l'existence de l'utilisateur
        if (user.length === 0) {
            throw new Error('User not found');
        }
        const users: UserModel = user[0];
        return new NextResponse(JSON.stringify({
            user: users,
            ok: true
        }), { status: 200 });
    }catch (error) {
        console.error('[user_login]', error);
        return new NextResponse('Internal error', {status: 500});
    }
}