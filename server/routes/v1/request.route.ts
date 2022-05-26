import { Router } from 'express'
import { RequestController } from '../../controllers'
import use from '../../errorHandler/global.error.handler';
import { AuthMiddleware } from '../../middlewares';
import { requestValidate } from '../../utils/helper';
import requestValidation from '../../validations/requestValidation';

const requestController = new RequestController();

const router = Router();
router.post('/create', [AuthMiddleware.member(), requestValidate(requestValidation.createRequest)], use(requestController.createRequest))
router.get('/:Id', [AuthMiddleware.member()], use(requestController.getRequestprofilById))
router.put('/:Id', use(requestController.updateRequest))
router.get('/', use(requestController.getAllRequest))
router.get('/member-profile/:Id', AuthMiddleware.member(), use(requestController.findRequestedMemberProfile))
router.post('/:Id/change-status', [AuthMiddleware.member(), requestValidate(requestValidation.changeStatus)], use(requestController.changeStatus))

export default router
