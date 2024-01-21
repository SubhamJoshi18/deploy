import { Request, Response, NextFunction } from 'express'
import * as userService from '../service/profile.service'
import { RequestWithUserObject } from '../types'

//DELETE user
export const deleteUser = async (
    req: RequestWithUserObject,
    res: Response,
    next: NextFunction
) => {
    try {
        await userService.removeUserByID(Number(req.params.id))
        res.json('deleted')
    } catch (error) {
        next(error)
    }
}

//GET profile
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

//GET by id
export const getUserByID = async (
    req: RequestWithUserObject,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.getUserByID(Number(req.params.id))
        res.json(user)
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
