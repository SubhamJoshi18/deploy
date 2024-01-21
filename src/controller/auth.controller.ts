import { Request, Response, NextFunction } from 'express'
import * as profileService from '../service/profile.service'
import { signupBodyDTO, loginBodyDTO } from '../validators/auth.validators'
// import { authenticateToken } from '../middlewares/auth.middleware'
// import { RequestWithUserObject } from '../types'

//REGISTER
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const start = performance.now()
        const createdUser = await profileService.signup(
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

        const { accessToken, refreshToken } = await profileService.login(
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
export const adminLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = loginBodyDTO.parse(req.body)

        const { accessToken, refreshToken } = await profileService.adminLogin(
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
//REFRESH
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { refreshToken } = req.cookies
    try {
        const token = await profileService.refresh(refreshToken)
        res.json({ accessToken: token })
    } catch (error) {
        next(error)
    }
}
