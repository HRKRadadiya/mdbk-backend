import { Segments } from 'celebrate'
import { Router } from 'express'
import { MemberController, ProfileController } from '../../controllers'
import use from '../../errorHandler/global.error.handler'
import { AuthMiddleware } from '../../middlewares'
import { requestValidate } from '../../utils/helper'
import { commonValidation, memberValidation, profile } from '../../validations'

const router = Router()
const controller = new MemberController()
const profileController = new ProfileController();

// Sign Up & Sign In Api
router.post('/check-email', requestValidate(commonValidation.validateEmailOnly), use(controller.isEmailRegistered))

// Sign In Api
router.post('/login', requestValidate(commonValidation.login), use(controller.login))

// Sign Up Api
router.post('/send-verification-code', requestValidate(commonValidation.validateEmailOnly), use(controller.generateVerificationCode))
router.post('/verify-email', requestValidate(memberValidation.verifyEmail), use(controller.verifyEmail))
router.post('/register', requestValidate(memberValidation.registerMember), use(controller.registerMember))

// Third party auth
router.post('/social-auth', requestValidate(memberValidation.socialAuth), use(controller.socialAuth))

// password reset Api
router.post('/reset-password-link', requestValidate(memberValidation.resetPasswordLink), use(controller.sendResetPasswordLink))
router.post('/confirm-reset-password', requestValidate(memberValidation.confirmResetPassword), use(controller.confirmResetPassword))

//switch Account
router.post('/switch-account', [requestValidate(memberValidation.switchAccount), AuthMiddleware.member()], use(controller.switchAccount))
router.get('/notifications', [requestValidate(memberValidation.switchAccount), AuthMiddleware.member()], use(controller.notificationList))

/* change notification */
router.post('/change/notification-setting', [requestValidate(profile.changeNotificationSetting), AuthMiddleware.member()], use(profileController.changeNotificationSetting))
router.put('/edit-information-setting', [requestValidate(profile.editInformationSetting), AuthMiddleware.member()], use(profileController.editInformationSetting))
router.delete('/:Id', AuthMiddleware.member(), use(profileController.deleteMamberAccount))

router.get('/my-profile', AuthMiddleware.member(), use(profileController.findMyPageSettigs))
router.post('/is-valid-token', AuthMiddleware.member(), use(profileController.isValidToken))
router.post('/like-unlike', [requestValidate(memberValidation.likeUnlike), AuthMiddleware.member()], use(profileController.likeUnlike))
router.post('/report-unreport', [requestValidate(memberValidation.reportUnreport), AuthMiddleware.member()], use(profileController.reportUnreport))

export default router
