import { Router } from 'express'
import use from '../../errorHandler/global.error.handler';
import TestController from '../../controllers/test.controller';

const testController = new TestController();
const router = Router();

router.get('/', use(testController.test))

router.delete('/duplicate-member', use(testController.deleteDuplicateProfile))

export default router
