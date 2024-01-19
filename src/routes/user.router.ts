import { Router } from 'express'
import * as userController from '../controller/user.controller'
import { validate } from '../util/validate'
import { loginBodyDTO } from '../validators/login.validator'
import { authenticateToken } from '../middlewares/auth.middleware'
const router = Router()

router.post('/signup', userController.register)
router.post('/login', userController.login)
router.delete('/delete', userController.deleteUser)
router.post('/refresh', userController.refreshToken)

export default router
