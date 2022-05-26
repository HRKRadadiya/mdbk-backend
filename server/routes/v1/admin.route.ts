import { Router } from 'express'
import { AdminAuthController } from '../../controllers'
import { AuthMiddleware } from '../../middlewares';
import { commonValidation } from '../../validations';

import userRoute from './user.route'
import excelRoute from './excel.route'
import memberSettingRoute from './memberSetting.route'
import projectSettingRoute from './projectSettings.route'
import forumSettingRoute from './forumSettings.route'
import { requestValidate } from '../../utils/helper';
import use from '../../errorHandler/global.error.handler';

const adminAuthController = new AdminAuthController();
const router = Router();

// admin login
router.post('/login', requestValidate(commonValidation.login), use(adminAuthController.login))

// user crud
router.use('/user', AuthMiddleware.user(), userRoute)

// user crud
router.use('/member', AuthMiddleware.user(), memberSettingRoute)

// project crud
router.use('/project', AuthMiddleware.user(), projectSettingRoute)

// project crud
router.use('/forum', AuthMiddleware.user(), forumSettingRoute)

// excel download
router.use('/excel', AuthMiddleware.user(), excelRoute)

export default router
