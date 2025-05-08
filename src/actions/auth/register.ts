'use server'

import prisma from "@/lib/prisma"
import bcryptjs from "bcryptjs"

export const registerUser = async (name: string, email: string, passwoord: string) => {
    try {
        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: bcryptjs.hashSync(passwoord),
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        return {
            ok: true,
            user: user,
            message: 'Usuario creado'
        }
    }
    catch (error) {
        console.log(error)
        return {
            ok: false,
            message: 'No se pudo crear el usuario'
        }
    }
}