import { z } from 'zod'

export const signupBodyDTO = z.object({
    email: z.string({
        required_error: 'email is required',
    }),
    password: z.string({
        required_error: 'password is required',
    }),
    isAdmin: z.boolean().default(false),
})
