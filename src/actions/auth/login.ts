'use server';

import { signIn } from '@/auth';
//import { sleep } from '@/utils';
//import { AuthError } from 'next-auth';

// ...

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        //await sleep(2)

        // imprimir datos
        //console.log(Object.fromEntries(formData))
        //console.log(formData)

        //await signIn('credentials', Object.fromEntries(formData));
        //await signIn('credentials', formData);
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirect: false,
        });
        return 'Success'
    } catch (error) {
        // if (error instanceof AuthError) {
        //     switch (error.type) {
        //         case 'CredentialsSignin':
        //             return 'Invalid credentials.';
        //         default:
        //             return 'Something went wrong.';
        //     }
        // }
        // throw error;

        if ((error as any).type === 'CredentialsSignin')
            return 'CredentialsSignin'

        //console.log(error)
        return 'UnknownError';

    }
}

export const login = async (email: string, password: string) => {
    try {
        await signIn('credentials', { email, password })
        return { ok: true }
    }
    catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se puedo iniciar sesión'
        }
    }
}