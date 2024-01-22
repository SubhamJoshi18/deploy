import { Request, Response, NextFunction } from 'express'

export const addCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log('okk')
    next()
}
