import { z } from 'zod'

export const postTodoDTO = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required',
        }),
        status: z.enum(['completed', 'ongoing'], {
            required_error: 'Status should be either completed or ongoing',
        }),
    }),
})
