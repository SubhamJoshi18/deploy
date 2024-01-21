import Boom from '@hapi/boom'
import prisma from '../util/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { exclude } from '../util/exclude'
import { signupBodyDTO } from '../validators/auth.validators'
import {
    createAccessToken,
    verifyRefreshToken,
    verifyAccessToken,
    createRefreshToken,
} from '../util/token.util'

//SIGNUP
export const signup = async (user: z.infer<typeof signupBodyDTO>) => {
    const { email, password, is_admin } = user
    try {
        return await prisma.user.create({
            data: {
                email,
                password: await bcrypt.hash(password, 10),
                is_admin: is_admin,
            },
            select: {
                email: true,
                id: true,
                is_admin: true,
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
    const accessToken = createAccessToken(user.id, user.is_admin)
    const refreshToken = createRefreshToken(user.id, user.is_admin)

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

//GET by id
export const getUser = async (id: number) => {
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: { id },
            include: {
                addresses: true,
            },
        })
        return exclude(user, ['password'])
    } catch (err: any) {
        if (err.code === 'P2025') {
            throw Boom.notFound(`User with id ${id} does not exist`)
        }
        throw err
    }
}

//GET all user for admin
export const getAllUser = async () => {
    try {
        const user = await prisma.user.findMany()
        return user
    } catch (err: any) {
        throw err
    }
}
//UPDATE
export const updateUser = async (
    id: number,
    body: z.infer<typeof signupBodyDTO>
) => {
    const { email, password } = body
    try {
        await prisma.user.findUniqueOrThrow({
            where: { id: Number(id) },
        })
        return await prisma.user.update({
            where: { id: Number(id) },
            data: {
                email: email,
                password: password,
            },
        })
    } catch (err: any) {
        if (err.code === 'P2025') {
            throw Boom.notFound(`User with id ${id} does not exist`)
        }
        throw err
    }
}
