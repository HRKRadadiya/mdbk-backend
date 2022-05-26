import { Router } from 'express'
import { ClientProfileController, ProfileController } from '../../controllers'
import { client } from '../../validations';
import { requestValidate } from '../../utils/helper'
import use from '../../errorHandler/global.error.handler';
import { AuthMiddleware } from '../../middlewares';

const clientProfileController = new ClientProfileController();
const profileController = new ProfileController();
const router = Router();

/* Client Profile */
router.get('/profile/:Id', AuthMiddleware.member(false), use(profileController.findClientProfile))

router.get('/', AuthMiddleware.member(), use(clientProfileController.getAllClients))
router.get('/byMemberId', AuthMiddleware.member(), use(clientProfileController.getClientProfileByMemberId))
router.get('/:Id', AuthMiddleware.member(), use(clientProfileController.getClientProfile))
router.post('/generateVerificationCode', AuthMiddleware.member(), use(clientProfileController.generateSmsVerificationCode))
router.post('/verifyPhone', AuthMiddleware.member(), use(clientProfileController.verifyPhone))
router.post('/create', AuthMiddleware.member(), use(clientProfileController.createClientProfile))
router.put('/:Id', AuthMiddleware.member(), use(clientProfileController.updateClientProfile))


// ************************************ New *************************************

router.post('/edit-profile/step1', [AuthMiddleware.member(), requestValidate(client.editProfileStep1)], use(profileController.clientProfileStep1))
router.post('/edit-profile/step2', AuthMiddleware.member(), use(profileController.clientProfileStep2))
router.post('/edit-profile/step3', [AuthMiddleware.member(), requestValidate(client.editProfileStep3)], use(profileController.clientProfileStep3))

export default router
