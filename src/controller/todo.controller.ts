import { Request, Response, NextFunction } from 'express'
import * as todoService from '../service/todo.service'

//POST todos
export const postTodos = (req: Request, res: Response, next: NextFunction) => {
    const response = todoService.postTodo(req.body)
    res.send(response)
}

//GET all todos
export const getAllTodos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await todoService.getAll()
        res.json(response)
    } catch (err) {
        next(err)
    }
}

//GET by id
export const getTodosByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await todoService.getTodo(req.params.id)
        res.json(response)
    } catch (err) {
        next(err)
    }
}

//DELETE by id
export const deleteTodosByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await todoService.deleteTodo(req.params.id)
        res.json(response)
    } catch (err) {
        next(err)
    }
}

//UPDATE by id
export const updateTodo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await todoService.updateTodo(req.params.id, req.body)
        res.json(response)
    } catch (err) {
        next(err)
    }
}
