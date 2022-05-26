import { Router } from 'express'
import { PaymentController } from '../../controllers';
import use from '../../errorHandler/global.error.handler';

const paymentController = new PaymentController();
const router = Router();

// admin login
router.post('/purchase-package', use(paymentController.purchasePackage))

router.get('/coin-history', use(paymentController.getCoinHistory))

export default router
