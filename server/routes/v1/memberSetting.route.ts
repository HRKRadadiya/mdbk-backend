import { Router } from 'express'
import { MemberSettingController } from '../../controllers'
import { memberSettingValidation } from '../../validations';
import { requestValidate } from '../../utils/helper'
import use from '../../errorHandler/global.error.handler';

const memberSettingController = new MemberSettingController();
const router = Router();

router.get('/active', use(memberSettingController.getAllActiveMembers))
router.get('/termination', use(memberSettingController.getAllTerminationMembers))
router.get('/coin-member-list', use(memberSettingController.coinMemberList))

router.get('/reported-member-list', use(memberSettingController.reportedMemberList))
router.delete('/reported-member', requestValidate(memberSettingValidation.deleteReportedMember), use(memberSettingController.deleteReportedMember))
router.post('/termination/change-status', use(memberSettingController.changeMembersTerminationStatus))
router.post('/', requestValidate(memberSettingValidation.createMember), use(memberSettingController.createMember))
router.put('/:Id', requestValidate(memberSettingValidation.updateMember), use(memberSettingController.updateMember))
router.get('/:Id', use(memberSettingController.fetchMember)),
    router.get('/:Id/profile', use(memberSettingController.fetchMemberFullProfile))
router.get('/:Id/coin-history', use(memberSettingController.getCoinHistory))

export default router
