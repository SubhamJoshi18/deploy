import { Router } from 'express'
import * as todoController from '../controller/todo.controller'
import { validate } from '../util/validate'
import { postTodoDTO } from '../validators/postTodo.validator'
import { getTodoDTO } from '../validators/getTodo.validator'
import { deleteTodoDTO } from '../validators/deleteTodo.validator'
import { updateTodoDTO } from '../validators/updateTodo.validator'
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware'
const router = Router()

//POST to databse
router.post(
    '/',
    validate(postTodoDTO),
    authenticateToken,
    todoController.postTodos
)

///GET all todos
router.get('/', authenticateToken, todoController.getAllTodos)

//GET todos by id
router.get(
    '/:id',
    validate(getTodoDTO),
    authenticateToken,
    todoController.getTodosByID
)

//DELETE by id
router.delete(
    '/:id',
    validate(deleteTodoDTO),
    authenticateToken,
    isAdmin,
    todoController.deleteTodosByID
)

//UPDATE by id
router.put(
    '/:id',
    validate(updateTodoDTO),
    authenticateToken,
    todoController.updateTodo
)

export default router
