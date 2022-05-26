import { Router } from 'express'
import { ProvinceController } from '../../controllers'
import use from '../../errorHandler/global.error.handler';

const provinceController = new ProvinceController();

const router = Router();
router.post('/create', use(provinceController.createProvince))
router.put('/:Id', use(provinceController.updateProvince))
router.get('/', use(provinceController.getAllProvince))
router.get('/:Id', use(provinceController.getProvinceById))

export default router