import { Request, Response, NextFunction } from 'express'
import * as userService from '../service/profile.service'
import { signupBodyDTO, loginBodyDTO } from '../validators/auth.validators'
import { RequestWithUserObject } from '../types'

//DELETE user
export const deleteUser = async (
    req: RequestWithUserObject,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.user.userId
        const is_admin = req.user.isAdmin
        const user = await userService.removeUser(id, is_admin)
        res.json('deleted')
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
