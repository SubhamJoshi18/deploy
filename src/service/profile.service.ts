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

    if (user.is_admin) {
        throw Boom.badRequest('Admin account not usable here')
    }
    const accessToken = createAccessToken(user.id, user.is_admin)
    const refreshToken = createRefreshToken(user.id, user.is_admin)

    return { accessToken, refreshToken }
}

export const adminLogin = async (email: string, password: string) => {
    const user = await prisma.user.findFirst({ where: { email } })
    if (!user) {
        throw Boom.badRequest('Username or password is incorrect.')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw Boom.badRequest('Username or password is incorrect.')
    }

    if (!user.is_admin) {
        throw Boom.unauthorized('Admin only login')
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
export const removeUser = async (id: number, is_admin: boolean) => {
    const user = await prisma.user.findFirst({ where: { id } })
    if (!user) {
        throw Boom.badRequest('Id does not exist.')
    }
    if (user.is_admin && !is_admin) {
        throw Boom.badRequest('Cannot delete admin')
    }

    return prisma.user.delete({
        where: {
            id,
        },
    })
}

//DELETE by id
export const removeUserByID = async (id: number) => {
    const user = await prisma.user.findFirst({ where: { id } })
    if (!user) {
        throw Boom.notFound('ID does not exist')
    }

    return prisma.user.delete({
        where: {
            id: id,
        },
    })
}

//GET user
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
//GEt by id by admin
export const getUserByID = async (id: number) => {
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
    const { password } = body
    let pass = await bcrypt.hash(password, 10)
    try {
        await prisma.user.findUniqueOrThrow({
            where: { id: Number(id) },
        })
        return await prisma.user.update({
            where: { id: Number(id) },
            data: {
                password: pass,
            },
        })
    } catch (err: any) {
        if (err.code === 'P2025') {
            throw Boom.notFound(`User with id ${id} does not exist`)
        }
        throw err
    }
}
