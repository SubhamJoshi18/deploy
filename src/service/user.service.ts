import Boom from '@hapi/boom'
import prisma from '../util/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { signupBodyDTO } from '../validators/signup.validator'
import {
    createAccessToken,
    verifyRefreshToken,
    verifyAccessToken,
    createRefreshToken,
} from '../util/token.util'

//SIGNUP
export const signup = async (user: z.infer<typeof signupBodyDTO>) => {
    const { email, password, isAdmin } = user
    try {
        return await prisma.user.create({
            data: {
                email,
                password: await bcrypt.hash(password, 10),
                isAdmin: isAdmin,
            },
            select: {
                email: true,
                id: true,
                isAdmin: true,
            },
        })
    } catch (err: any) {
        throw Boom.unauthorized('Something went wrong')
    }
}

//LOGIN
export const login = async (email: string, password: string) => {
    const user = await prisma.user.findFirst({ where: { email } })
    if (!user) {
        throw Boom.badRequest('Username or password is incorrect.')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw Boom.badRequest('Username or password is incorrect.')
    }
    const accessToken = createAccessToken(user.id, user.isAdmin)
    const refreshToken = createRefreshToken(user.id, user.isAdmin)

    return { accessToken, refreshToken }
}

//REFRESH
export async function refresh(refreshToken: string) {
    try {
        const decodedToken: any = verifyRefreshToken(refreshToken)
        console.log(decodedToken)
        return createAccessToken(decodedToken.userId, decodedToken.isAdmin)
    } catch (error) {
        throw Boom.unauthorized('User is not logged in')
    }
}

//DELETE USER
export const removeUser = async (email: string, password: string) => {
    const user = await prisma.user.findFirst({ where: { email } })
    if (!user) {
        throw Boom.badRequest('Username or password is incorrect.')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw Boom.badRequest('Username or password is incorrect.')
    }

    return prisma.user.delete({
        where: {
            email: user.email,
        },
    })
}
