import { Router } from 'express'
import * as userController from '../controller/user.controller'
import { validate } from '../util/validate'
import { loginDTO, signupDTO } from '../validators/auth.validators'
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware'
const router = Router()

router.post('/signup', validate(signupDTO), userController.register)
router.post('/login', validate(signupDTO), userController.login)
//router.post('/logout', userController.logout)
router.delete(
    '/admin/delete',
    authenticateToken,
    isAdmin,
    userController.deleteUser
)
router.delete('/delete', authenticateToken, userController.deleteUser)
router.post('/refresh', authenticateToken, userController.refreshToken)
router.put('/update', authenticateToken, userController.updateUser)
router.get('/', authenticateToken, userController.getUser)
router.get('/', authenticateToken, isAdmin, userController.getAllUser)

export default router
