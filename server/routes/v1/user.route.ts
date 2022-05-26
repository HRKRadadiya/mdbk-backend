import { Segments } from 'celebrate';
import { Router } from 'express'
import { UserController } from '../../controllers'
import { commonValidation, userValidation } from '../../validations';
import { requestValidate } from '../../utils/helper'
import use from '../../errorHandler/global.error.handler';

const userController = new UserController();
const router = Router();

router.get('/', use(userController.getAllUser))
router.post('/', requestValidate(userValidation.createUser), use(userController.createUser))
router.get('/:Id', use(userController.getUserById))
router.put('/:Id', requestValidate(userValidation.updateUser), use(userController.updateUser))
router.delete('/:Id', use(userController.deleteUser))
router.delete('/', use(userController.deleteAllUsers))

export default router
