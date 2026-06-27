import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import connectDB from '@/lib/db'
import { AdminUser } from '@/models'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.password) {
          throw new Error('Password is required')
        }

        await connectDB();

        const user = await AdminUser.findOne();

        if (!user) return null;

        // Password Comparison
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          console.log("DEBUG: Password mismatch for user:", user.email);
          return null;
        }

        return { 
          id: user._id.toString(), 
          email: user.email, 
          name: user.name, 
          role: user.role 
        };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  pages: { signIn: '/admin/login', error: '/admin/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Debugging band kar di hai kyunki ab sab working hai
}

declare module 'next-auth' {
  interface User { id: string; role: string; name?: string | null; email?: string | null; }
  interface Session { user: { id: string; name?: string | null; email?: string | null; role: string; } }
}
declare module 'next-auth/jwt' {
  interface JWT { id: string; role: string; }
}