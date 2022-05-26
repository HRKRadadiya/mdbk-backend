import { Router } from 'express'
import { ExcelController } from '../../controllers'
import use from '../../errorHandler/global.error.handler';

const controller = new ExcelController();
const router = Router();

router.get('/members', use(controller.downloadAllMembers))

export default router
