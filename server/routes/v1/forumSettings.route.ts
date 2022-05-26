import { Router } from 'express'
import ForumSettingController from '../../controllers/admin/ForumSettingsController';
import use from '../../errorHandler/global.error.handler';
import { AuthMiddleware } from '../../middlewares';


const router = Router();

const forumSettingController = new ForumSettingController();
router.get('/question-list', [AuthMiddleware.user()], use(forumSettingController.getForumQuestionList))
router.get('/question/:Id', [AuthMiddleware.user()], use(forumSettingController.findQuestionById))
router.delete('/questions', [AuthMiddleware.user()], use(forumSettingController.deleteForums))
router.get('/response-list', [AuthMiddleware.user()], use(forumSettingController.getForumResponseList))

router.get('/response/:Id', [AuthMiddleware.user()], use(forumSettingController.findResponseById))
router.delete('/response', [AuthMiddleware.user()], use(forumSettingController.deleteResponseForum))

router.get('/report-list', [AuthMiddleware.user()], use(forumSettingController.formReportList))
router.delete('/reported-forum', [AuthMiddleware.user()], use(forumSettingController.deleteReportedMember))
router.get('/reported-forum', [AuthMiddleware.user()], use(forumSettingController.findReportedForum))

/* Delete forum comments */
router.delete('/comment/:Id', [AuthMiddleware.user()], use(forumSettingController.deletComments))

router.post('/change-status/:Id', [AuthMiddleware.user()], use(forumSettingController.changeStatus))

export default router