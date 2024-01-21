import { Router } from 'express'
import * as userController from '../controller/user.controller'
import * as authController from '../controller/auth.controller'
import { validate } from '../util/validate'
import { loginDTO, signupDTO } from '../validators/auth.validators'
import {
    authenticateToken,
    isMyAccount,
    isUser,
} from '../middlewares/auth.middleware'
const router = Router()

router.post('/signup', authController.register)
router.post('/login', authController.login)
router.post('/refresh', authenticateToken, authController.refreshToken)
//router.post('/logout', userController.logout)
router.get('/profile', authenticateToken, isUser, userController.getUser)
router.delete(
    '/profile/delete',
    authenticateToken,
    isUser,
    isMyAccount,
    userController.deleteUser
)
router.put(
    '/profile/update',
    authenticateToken,
    isUser,
    isMyAccount,
    userController.updateUser
)

export default router
