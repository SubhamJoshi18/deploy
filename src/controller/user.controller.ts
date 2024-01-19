import { Request, Response, NextFunction } from 'express'
import * as userService from '../service/user.service'
import { signupBodyDTO } from '../validators/signup.validator'
import { loginBodyDTO } from '../validators/login.validator'

//REGISTER
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const createdUser = await userService.signup(
            signupBodyDTO.parse(req.body)
        )
        res.status(201).json(createdUser)
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

//DELETE user
export const deleteUser = async (
    req: Request,
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
