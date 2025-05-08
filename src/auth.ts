import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';


// import type { User } from '@/app/lib/definitions';
// import bcrypt from 'bcrypt';
// import postgres from 'postgres';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// async function getUser(email: string): Promise<User | undefined> {
//     try {
//         const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
//         return user[0];
//     } catch (error) {
//         console.error('Failed to fetch user:', error);
//         throw new Error('Failed to fetch user.');
//     }
// }

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                // if (parsedCredentials.success) {
                //     const { email, password } = parsedCredentials.data;
                //     const user = await getUser(email);
                //     if (!user) return null;
                //     const passwordsMatch = await bcrypt.compare(password, user.password);

                //     if (passwordsMatch) return user;
                // }

                // console.log('Invalid credentials');
                // return null;


                // código agregado

                if (!parsedCredentials.success) return null;
                const { email, password } = parsedCredentials.data;
                //console.log('archivo: auth.ts');
                //console.log({ email, password });

                // buscar correo y comparar contraseñas

                const user = await prisma.user.findUnique({ where: { email: email.toLocaleLowerCase() } });
                if (!user) return null;

                if (!bcryptjs.compareSync(password, user.password)) return null;

                //console.log("user ok!")

                // retornamos el usuario sin el password, renombramos la propiedad password por _ porque ya existe arriba
                const { password: _, ...rest } = user;
                console.log({ resto: rest })
                return rest;
            },
        }),
    ],
});