import { z } from 'zod'

export const updateTodoDTO = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title must be a string' }),
        status: z.enum(['completed', 'ongoing']),
    }),
    params: z.object({
        id: z.string().refine((value) => !isNaN(Number(value)), {
            message: 'ID must be a number',
        }),
    }),
})
