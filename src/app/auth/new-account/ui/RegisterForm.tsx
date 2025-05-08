'use client'

import { login } from '@/actions/auth/login'
import { registerUser } from '@/actions/auth/register'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"

type FormInputs = {
    name: string,
    email: string,
    password: string,
}

export const RegisterForm = () => {

    const [errorMessage, setErrorMessage] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>()

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        const { name, email, password } = data
        const resp = await registerUser(name, email, password)

        if (!resp.ok) {
            setErrorMessage(resp.message)
            return;
        }

        setErrorMessage('')

        await login(email.toLowerCase(), password)
        window.location.replace('/')

        //console.log({ resp })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

            {/* {
                errors.name?.type === 'required' && (<span className='text-red-500 text-xs'>El nombre es obligatorio</span>)
            } */}

            <label htmlFor="email">Nombre completo</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': !!errors.name
                        }
                    )
                }
                type="text"
                autoFocus
                {...register('name', { required: true })} />

            <label htmlFor="email">Correo electrónico</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': !!errors.email
                        }
                    )
                }
                type="email"
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })} />

            <label htmlFor="password">Contraseña</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': !!errors.password
                        }
                    )
                }
                type="password"
                {...register('password', { required: true, minLength: 6 })} />


            {/* {
                errorMessage && (<span className='text-red-500 text-xs'>{errorMessage}</span>)
            } */}
            <span className='text-red-500 text-xs'>{errorMessage}</span>

            <button
                className="btn-primary">
                Crear cuenta
            </button>


            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/login"
                className="btn-secondary text-center">
                Ingresar
            </Link>

        </form>
    )
}
