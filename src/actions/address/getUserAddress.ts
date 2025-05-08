'use server'

import prisma from "@/lib/prisma"

export const getUserAddress = async (userId: string) => {
    try {
        const userAddress = await prisma.userAddress.findUnique({
            where: {
                userId: userId
            }
        })
        if (userAddress) {
            const { countryId, ...resto } = userAddress
            return {
                ...resto,
                country: countryId,
                //address2: address2 ? address2 : ''
            }
        }
        return {} // el uso de Partial no permite retornar nulo
    } catch (error) {
        console.log(error)
        return {} 
    }
}