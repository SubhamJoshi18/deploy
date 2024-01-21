import { Router } from 'express'
import * as adminController from '../controller/admin.controller'
import * as authController from '../controller/auth.controller'
import { validate } from '../util/validate'
import { loginDTO, signupDTO } from '../validators/auth.validators'
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware'
const router = Router()

router.post('/signup', authController.register)
router.post('/login', authController.adminLogin)
router.post('/refresh', authenticateToken, isAdmin, authController.refreshToken)
//router.post('/logout', adminController.logout)
router.delete(
    '/delete/:id',
    authenticateToken,
    isAdmin,
    adminController.deleteUser
)
router.put('/update', authenticateToken, isAdmin, adminController.updateUser)
router.get('/', authenticateToken, isAdmin, adminController.getUser)
router.get('/:id', authenticateToken, isAdmin, adminController.getUserByID)
router.get('/all-users', authenticateToken, isAdmin, adminController.getAllUser)

export default router
