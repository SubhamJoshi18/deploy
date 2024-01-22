import { Router } from 'express'
import * as categoryController from '../controller/categories.controller'
const router = Router()

router.post('/', categoryController.addCategories)

export default router
