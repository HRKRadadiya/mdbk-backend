import { Router } from 'express'
import { SearchOptionController } from '../../controllers'
import use from '../../errorHandler/global.error.handler';

const searchOptionController = new SearchOptionController();

const router = Router();
router.post('/create', use(searchOptionController.createSearchOption))
router.put('/:Id', use(searchOptionController.updateSearchOption))

export default router

