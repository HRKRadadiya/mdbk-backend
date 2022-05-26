import { Router } from 'express'
import { SideCharacterProfileController, ProfileController } from '../../controllers'
import { sideCharacter } from '../../validations';
import { requestValidate } from '../../utils/helper'
import use from '../../errorHandler/global.error.handler';
import { AuthMiddleware } from '../../middlewares';

const sideCharacterProfileController = new SideCharacterProfileController();
const profileController = new ProfileController();

const router = Router();
router.get('/profile/:Id', AuthMiddleware.member(false), use(profileController.sideCharFindProfile))
router.post('/create', AuthMiddleware.member(), use(sideCharacterProfileController.createSideCharacterProfile))
router.get('/byMemberId', AuthMiddleware.member(), use(sideCharacterProfileController.getSideCharacterByMemberId))
router.get('/side-character-all-project/:profession', AuthMiddleware.member(), use(sideCharacterProfileController.getSideCharacterAllProject))
router.get('/:profession', AuthMiddleware.member(), use(sideCharacterProfileController.getSideCharacterByProfession))
router.put('/:Id', AuthMiddleware.member(), use(sideCharacterProfileController.updateSideCharacterProfile))


// ************************************ New *************************************

router.post('/edit-profile/step1', [AuthMiddleware.member(), requestValidate(sideCharacter.editProfileStep1)], use(profileController.sideCharProfileStep1))
router.post('/edit-profile/step2', AuthMiddleware.member(), use(profileController.sideCharProfileStep2))
router.post('/edit-profile/step3', [AuthMiddleware.member(), requestValidate(sideCharacter.editProfileStep3)], use(profileController.sideCharProfileStep3))

router.delete('/experience/:Id', AuthMiddleware.member(), use(profileController.sideCharDeleteExperience))


export default router
