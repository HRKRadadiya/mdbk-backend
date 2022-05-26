import { Router } from 'express'
import { SearchController } from '../../controllers';
import use from '../../errorHandler/global.error.handler';
import { AuthMiddleware } from '../../middlewares';
import { requestValidate } from '../../utils/helper';
import { search } from '../../validations';

const searchController = new SearchController();

const router = Router();

router.get('/side-character', [AuthMiddleware.member(false), requestValidate(search.side_character)], searchController.sideCharacter)
router.get('/client', [AuthMiddleware.member(false), requestValidate(search.client)], use(searchController.client))
router.get('/project', [AuthMiddleware.member()], use(searchController.project))
router.get('/my-like', AuthMiddleware.member(true), use(searchController.myLike))
router.get('/sent-requests', AuthMiddleware.member(true), use(searchController.sentAndReceiveRequests))
router.get('/without-auth/project', use(searchController.findProject))

export default router
