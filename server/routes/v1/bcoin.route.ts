import { Router } from 'express'
import BCoinController from '../../controllers/bCoin.controller';
import use from '../../errorHandler/global.error.handler';

const bCoinController = new BCoinController();
const router = Router();

// admin login
router.get('/packages', use(bCoinController.getBcoinPackages))

export default router
