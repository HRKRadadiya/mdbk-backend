import { Router } from 'express'
import ProjectController from '../../controllers/project.controller';
import use from '../../errorHandler/global.error.handler';
import { AuthMiddleware } from '../../middlewares';
import { requestValidate } from '../../utils/helper';
import projectValidation from '../../validations/projectValidation';

const projectController = new ProjectController();

const router = Router();
router.post('/', [AuthMiddleware.member(), requestValidate(projectValidation.createProject)], use(projectController.createProject))
router.post('/apply-project-application', [AuthMiddleware.member()], use(projectController.applyForProjectApplication)) // , requestValidate(projectValidation.applyForProjectApplication)
router.get('/', [AuthMiddleware.member()], use(projectController.getProjectsByMeberId))
router.get('/project-application-details/:Id', [AuthMiddleware.member(false)], use(projectController.getProjectApplicationDetails))
router.put('/:Id', [AuthMiddleware.member()], use(projectController.updateProject))
router.get('/:Id', [AuthMiddleware.member(false)], use(projectController.findProjectById))
router.get('/:Id/project-applicants', [AuthMiddleware.member()], use(projectController.getProjectApplicantsById))
router.post('/project-applicant/change-status', [AuthMiddleware.member(), requestValidate(projectValidation.changeProjectApplicantStatus)], use(projectController.changeProjectApplicantStatus))
router.delete('/:Id', [AuthMiddleware.member()], use(projectController.deleteProposal))
router.get('/side-character/proposals', [AuthMiddleware.member()], use(projectController.getSideCharacterSentProposals))


export default router