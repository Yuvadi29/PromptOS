import NextAuth from "next-auth";
import { createClient } from '@supabase/supabase-js'
import Google from "next-auth/providers/google";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
            const { data, error } = await supabase.from("users").upsert({
                id: user?.id,
                name: user?.name,
                email: user?.email,
                image: user?.image,
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