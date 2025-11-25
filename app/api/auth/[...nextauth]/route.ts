import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase";

const handler = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
    ],
    callbacks: {
        async signIn({ user }) {

            // Save user info to supabase manually
            const { error } = await supabaseAdmin.from("users").upsert({
                id: user?.id,
                name: user?.name,
                email: user?.email,
                image: user?.image,
                username: user?.name?.split(' ')[0]
            })

            if (error) {
                console.error("Supabase inser error: ", error);
            }
            return true
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }