import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
        newUser: '/auth/new-account',
    },
    callbacks: {
        jwt({ token, user }) {
            //console.log({ token, user })
            if (user)
                token.data = user
            return token
        },
        session({ session, token, user }) {
            //console.log({ session, token, user })
            session.user = token.data as any
            return session
        },
        authorized({ auth, request: { nextUrl } }) {
            //console.log(auth) // ya no es null
            return true;
        },
    },
    // callbacks: {
    //     authorized({ auth, request: { nextUrl } }) {
    //         const isLoggedIn = !!auth?.user;
    //         const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
    //         if (isOnDashboard) {
    //             if (isLoggedIn) return true;
    //             return false; // Redirect unauthenticated users to login page
    //         } else if (isLoggedIn) {
    //             return Response.redirect(new URL('/dashboard', nextUrl));
    //         }
    //         return true;
    //     },
    // },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

/*
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const authConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) return null;

                const { email, password } = parsedCredentials.data;
                console.log({ email, password });

                // buscar correo y comparar contraseñas


                return null;
            },
        }),
    ]
} satisfies NextAuthConfig;

export const { signIn, signOut, auth } = NextAuth(authConfig)
*/


//export const { signIn, signOut, auth: middleware } = NextAuth(authConfig)

// export const authConfig: NextAuthConfig = {
//     pages: {
//         signIn: '/login',
//     },
// }
