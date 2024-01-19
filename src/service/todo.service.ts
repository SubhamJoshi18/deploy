import Boom from '@hapi/boom'
import { PrismaClient } from '@prisma/client'
import router from '../routes/todo.router'
const prisma = new PrismaClient()

//POST todos
export const postTodo = async (body: any) => {
    const { title, status } = body
    return await prisma.todo.create({
        data: {
            title,
            status,
        },
    })
}

//GET all todo
export const getAll = async () => {
    return await prisma.todo.findMany({
        select: {
            id: true,
            title: true,
        },
    })
}

//GET todos by id
export const getTodo = async (id: any) => {
    try {
        return await prisma.todo.findUniqueOrThrow({
            where: {
                id: Number(id),
            },
        })
    } catch (err: any) {
        if (err.code === 'P2025') throw Boom.notFound('not found')
        else throw err
    }
}

//DELETE  by id
export const deleteTodo = async (id: any) => {
    try {
        await prisma.todo.findUniqueOrThrow({
            where: {
                id: Number(id),
            },
        })
        return await prisma.todo.delete({
            where: {
                id: Number(id),
            },
        })
    } catch (err: any) {
        if (err.code === 'P2025') throw Boom.notFound('Record not found')
        else throw err
    }
}

//UPDATE by id
export const updateTodo = async (id: any, body: any) => {
    const { title, status } = body
    try {
        await prisma.todo.findUniqueOrThrow({
            where: { id: Number(id) },
        })
        return await prisma.todo.update({
            where: { id: Number(id) },
            data: {
                title: title,
                status: status,
            },
        })
    } catch (err: any) {
        if (err.code === 'P2025') throw Boom.notFound('No such record exists')
        else throw err
    }
}
