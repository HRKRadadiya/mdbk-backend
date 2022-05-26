import { Router } from 'express'
import { MessageController } from '../../controllers'
import use from '../../errorHandler/global.error.handler';
import { AuthMiddleware } from '../../middlewares';

const messageController = new MessageController();

const router = Router();
router.post('/create',[AuthMiddleware.member()], use(messageController.createMessage))
router.get('/message-list', [AuthMiddleware.member()], use(messageController.getMessagesByLoginMemberId))
router.get('/memberId', use(messageController.getMessageByMemberId))
router.put('/:Id', use(messageController.updateMessage))
router.get('/', use(messageController.getAllMessage))
router.get('/:Id', use(messageController.getMessageById))
router.delete('/:Id', use(messageController.deleteMessage))

export default router
