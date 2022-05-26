import { Router } from 'express'
import { ProjectSettingController } from '../../controllers';
import use from '../../errorHandler/global.error.handler';
import { requestValidate } from '../../utils/helper';
import { projectSettingValidation } from '../../validations';

const projectSettingController = new ProjectSettingController();

const router = Router();
router.get('/project-list', requestValidate(projectSettingValidation.projectList), use(projectSettingController.getProjectList))
router.delete('/delete', use(projectSettingController.deleteProjects))
router.get('/:Id', use(projectSettingController.findProjectById))

export default router