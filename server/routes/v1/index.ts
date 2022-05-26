import { Router } from 'express'
import memberRoute from './member.route'
import clientProfileRoute from './clientProfile.route'
import sideCharacterProfileRoute from './sideCharacterProfile.route'
import profileRoute from './profile.route'
import messageRoute from './message.route'
import searchOptionRoute from './searchOption.route'
import requestRoute from './request.route'
import provinceRoute from './province.route'
import districtRoute from './district.route'
import adminRoute from './admin.route'
import bcoinRoute from './bcoin.route'
import paymentRoute from './payment.route'
import { AuthMiddleware } from '../../middlewares'
import searchRoutes from './search.route'
import testRoutes from './test.route'
import projectRoutes from './project.route'
import forumRouters from './forum.route'

import TestController from '../../controllers/test.controller'
const router = Router();

const allowPaths = [
    '/member/isEmailRegistered',
    '/member/registerMember',
    '/member/login',
    '/member/verifyEmail',
    '/member/generateVerificationCode',
    '/clientProfile/byMemberId',
    '/clientProfile/create',
    '/province',
    '/province/create',
    '/district',
    '/district/create',
    '/district/alldistrict/:Id',
    '/clientProfile/generateVerificationCode',
    '/clientProfile/verifyPhone',
    '/message/create',
    '/message/memberId'
]


router.use((req, res, next) => {
    if (allowPaths.includes(req.path)) {
        next()
    } else {
        next()
        // memberService
        //     .validateAccess(req.cookies.authorization) // Authenitication Using Cookie
        //     .then((response: any) => {
        //         const token = jwt.sign({ id: response.id, email: response.email }, JWT_KEY, { expiresIn: '1h' })
        //         /* req.email = response.email
        //         req.memberId = response.memberId
        //         req.memberName = response.name
        //         res.cookie('authorization', token, {
        //             expires: new Date(Date.now() + 1500000)
        //         }) */
        //         next()
        //     })
        //     .catch((error: any) => {
        //         res.status(httpStatus.UNAUTHORIZED).send({ error: { code: httpStatus.UNAUTHORIZED, message: 'Not Authorized' } })
        //     })
    }
});

const testController = new TestController();

router.use('/member', memberRoute)
router.use('/client', clientProfileRoute)
router.use('/side-character', sideCharacterProfileRoute)
router.use('/profile', AuthMiddleware.member(), profileRoute)
router.use('/message', messageRoute)
router.use('/bcoin', bcoinRoute)
router.use('/payment', AuthMiddleware.member(), paymentRoute)
router.use('/searchOption', searchOptionRoute)
router.use('/request', requestRoute)
router.use('/province', provinceRoute)
router.use('/district', districtRoute)
router.use('/search', searchRoutes)
router.use('/project', projectRoutes)
router.use('/forum', forumRouters)
router.use('/test', testRoutes)

// Admin Routes
router.use('/admin', adminRoute)

export default router
