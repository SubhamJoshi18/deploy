import { Request, Response, NextFunction } from 'express'
import * as userService from '../service/user.service'
import { signupBodyDTO, loginBodyDTO } from '../validators/auth.validators'
import { authenticateToken } from '../middlewares/auth.middleware'
import { RequestWithUserObject } from '../types'

//REGISTER
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const start = performance.now()
        const createdUser = await userService.signup(
            signupBodyDTO.parse(req.body)
        )
        const end = performance.now()
        const resTime = start - end
        res.status(201).json({ createdUser, 'Response time: ': resTime })
    } catch (err) {
        next(err)
    }
}

//LOGIN
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = loginBodyDTO.parse(req.body)

        const { accessToken, refreshToken } = await userService.login(
            email,
            password
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
        }).json({ accessToken })
    } catch (error) {
        next(error)
    }
}
//LOGOUT
// export const logout = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const { email, password } = loginBodyDTO.parse(req.body)

//         const { accessToken, refreshToken } = await userService.login(
//             email,
//             password
//         )
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//         }).json({ accessToken })
//     } catch (error) {
//         next(error)
//     }
// }

//DELETE user
export const deleteUser = async (
    req: RequestWithUserObject,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = loginBodyDTO.parse(req.body)

        const user = await userService.removeUser(email, password)
        res.json('deleted')
    } catch (error) {
        next(error)
    }
}

//REFRESH
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { refreshToken } = req.cookies
    try {
        const token = await userService.refresh(refreshToken)
        res.json({ accessToken: token })
    } catch (error) {
        next(error)
    }
}

//GET user by id
export const getUser = async (
    req: RequestWithUserObject,
    res: Response,
    next: NextFunction
) => {
    try {
        const userID = req.user.userId
        const user = await userService.getUser(userID)
        res.json({ user: user })
    } catch (error) {
        next(error)
    }
}

//UPDATE
export const updateUser = async (
    req: RequestWithUserObject,
    res: Response,
    next: NextFunction
) => {
    try {
        const userID = req.user.userId
        const user = await userService.updateUser(userID, req.body)
        res.json({ user: user })
    } catch (error) {
        next(error)
    }
}

//GET all user
export const getAllUser = async (
    req: RequestWithUserObject,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.getAllUser()
        res.json({ user: user })
    } catch (error) {
        next(error)
    }
}
