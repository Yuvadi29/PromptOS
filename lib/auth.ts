import { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import { supabaseAdmin } from '@/lib/supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      let country = 'Unknown';
      let region = 'Unknown';
      let city = 'Unknown';
      try {
        const { headers } = await import('next/headers');
        const headersList = await headers();
        country = headersList.get('x-vercel-ip-country') || 'Unknown';
        region = headersList.get('x-vercel-ip-country-region') || 'Unknown';
        city = headersList.get('x-vercel-ip-city') || 'Unknown';
      } catch (e) {
        console.warn('Failed to parse request headers in signIn callback:', e);
      }
      // Save user info and location to supabase manually
      const { error } = await supabaseAdmin.from('users').upsert({
        id: String(user?.id), // Enforce string coercion just to be doubly safe
        name: user?.name,
        email: user?.email,
        image: user?.image,
        username: user?.name?.split(' ')[0],
        country,
        region,
        city,
      });

      if (error) {
        console.error('Supabase insert error: ', error);
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
