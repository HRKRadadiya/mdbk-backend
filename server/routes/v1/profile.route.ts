import { Router } from 'express'
import { ProfileController } from '../../controllers'
import { client, profile, sideCharacter } from '../../validations';
import { requestValidate } from '../../utils/helper'
import use from '../../errorHandler/global.error.handler';

const profileController = new ProfileController();

const router = Router();

router.post('/send-phone-verification-code', requestValidate(profile.sendVerificationCode), use(profileController.sendPhoneVerifyCode))
router.post('/confirm-phone-verification', requestValidate(profile.confirmVerificationCode), use(profileController.confirmPhoneVerification))

/* upload related Images {portfolio, introductory} */
router.post('/related-images', requestValidate(profile.uploadRelatedImages), use(profileController.uploadRelatedImages))
router.delete('/related-image/:Id', requestValidate(profile.removeRelatedImages), use(profileController.removeRelatedImages))

/* upload profile images */
router.post('/profile-picture', requestValidate(profile.uploadProfileImages), use(profileController.uploadProfilePicture))

/* side character */
// router.post('/side-character/edit-profile/step1', sideCharacter.editProfileStep1, profileController.sideCharProfileStep1)
// router.post('/side-character/edit-profile/step2', sideCharacter.editProfileStep2, profileController.sideCharProfileStep2)
// router.post('/side-character/edit-profile/step3', sideCharacter.editProfileStep3, profileController.sideCharProfileStep3)

// router.delete('/side-character/experience/:Id', profileController.sideCharDeleteExperience)
// router.get('/side-character/profile', profileController.sideCharFindProfile)

/* client */
// router.post('/client/edit-profile/step1', client.editProfileStep1, profileController.clientProfileStep1)
// router.post('/client/edit-profile/step2', client.editProfileStep2, profileController.clientProfileStep2)
// router.post('/client/edit-profile/step3', client.editProfileStep3, profileController.clientProfileStep3)

// router.get('/client/profile', profileController.findClientProfile)

/* change notification */
// router.post('/member/change/notification-setting', profile.changeNotificationSetting, profileController.changeNotificationSetting)
// router.put('/member/edit-information-setting', profile.editInformationSetting, profileController.editInformationSetting)
// router.delete('/member/:Id', profileController.deleteMamberAccount)

export default router
