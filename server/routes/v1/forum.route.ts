import { Router } from 'express'
import ForumController from '../../controllers/forum.controller';
import use from '../../errorHandler/global.error.handler';
import { AuthMiddleware } from '../../middlewares';
import { requestValidate } from '../../utils/helper';
import forumValidation from '../../validations/forum.validation';


const router = Router();

const forumController = new ForumController();
router.post('/create', [AuthMiddleware.member()], use(forumController.createForum))
router.get('/question-list', [AuthMiddleware.member(false)], use(forumController.getQuestionList))
router.post('/vote', [AuthMiddleware.member(), requestValidate(forumValidation.forumVote)], use(forumController.forumVote))
router.put('/:id', [AuthMiddleware.member()], use(forumController.editForum))
router.delete('/:Id', [AuthMiddleware.member()], use(forumController.deleteForum))
router.get('/response-list', [AuthMiddleware.member(false)], use(forumController.getForumsResponse))
router.post('/comment/create', [AuthMiddleware.member(), requestValidate(forumValidation.text)], use(forumController.createComment))
router.put('/comment/:Id', [AuthMiddleware.member()], use(forumController.editComment))
router.delete('/comment/:Id', [AuthMiddleware.member()], use(forumController.deleteComment))

router.post('/report-unreport', [AuthMiddleware.member()], use(forumController.reportUnreport))
router.get('/draft-question', [AuthMiddleware.member()], use(forumController.findDraftQuestion))




export default router