import { z } from 'zod'

//SIGNUP
export const signupBodyDTO = z.object({
    email: z
        .string({
            required_error: 'email is required',
        })
        .email({
            message: 'must be a valid email',
        }),
    password: z.string({
        required_error: 'password is required',
    }),
    is_admin: z.boolean().default(false),
    phone_number: z.string(),
})

export const signupDTO = z.object({
    body: signupBodyDTO,
})

//LOGIN
export const loginBodyDTO = z.object({
    email: z.string({
        required_error: 'email is required',
    }),
    password: z.string({
        required_error: 'password is required',
    }),
})

export const loginDTO = z.object({
    body: loginBodyDTO,
})
