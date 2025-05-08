'use client'

import Link from 'next/link'
import React, { useEffect } from 'react'

//import { useActionState } from 'react';
import { authenticate } from '@/actions/auth/login';
//import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { IoInformationOutline } from 'react-icons/io5';
import clsx from 'clsx';
//import { useRouter } from 'next/navigation';

export const LoginForm = () => {
    // const searchParams = useSearchParams();
    // const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    // const [errorMessage, formAction, isPending] = useActionState(
    //     authenticate,
    //     undefined,
    // );

    //const router = useRouter()
    const [state, dispatch] = useFormState(authenticate, undefined);
    //console.log({ state });


    useEffect(() => {
        if (state === 'Success')
            //router.replace('/')
            window.location.replace('/') // para que se haga el refresh de la aplicación
    }, [state])


    return (
        // <form action={formAction} className="flex flex-col">
        <form action={dispatch} className="flex flex-col">

            <label htmlFor="email">Correo electrónico</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="email" name='email' />


            <label htmlFor="password">Contraseña</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="password" name='password' />

            <LoginButton />
            {/* 
            <button
                className="btn-primary"
                type='submit'
            // aria-disabled={isPending}
            >
                Ingresar
            </button> */}

            {/* <input type="hidden" name="redirectTo" value={callbackUrl} /> */}
            {/* <Button className="mt-4 w-full" aria-disabled={isPending}>
                    Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                </Button> */}

            {/*
            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {errorMessage && (
                    <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" /> 
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    </>
                )}
            </div>
            */}

            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {state === "CredentialsSignin" && (
                    <>
                        <IoInformationOutline className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">Credenciales no son correctas</p>
                    </>
                )}
            </div>

            {/* divisor line */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/new-account"
                className="btn-secondary text-center">
                Crear una nueva cuenta
            </Link>

        </form>
    )
}

function LoginButton() {
    const { pending } = useFormStatus()

    return (
        <button
            className={clsx({
                "btn-primary": !pending,
                "btn-disabled": pending
            })
            }
            type='submit'
            disabled={pending}
        >
            Ingresar
        </button>

    )
}