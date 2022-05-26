import { Router } from 'express'
import { DistrictController } from '../../controllers'
import use from '../../errorHandler/global.error.handler';

const districtController = new DistrictController();


const router = Router();
router.post('/create', use(districtController.createDistrict))
router.get('/alldistrict/:Id', use(districtController.getDistrictByProvinceId))
router.put('/:Id', use(districtController.updateDistrict))
router.get('/', use(districtController.getAllDistrict))
router.get('/:Id', use(districtController.getDistrictById))

export default router