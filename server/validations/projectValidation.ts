import { ProjectApplicationService } from "../services";

export default {
    createProject: {
        rules: {
            profession: 'required|in:development,design,marketing,other',
            field: 'required',
            current_planning_stage: 'required|in:idea-ready,content-organization-complete,detailed-plan-ready,other,direct',
            suggested_amount: 'required',
            schedule: 'required|in:negotiable,asap,not-hurry,direct',
            // schedule_direct_start_date: 'required',
            // schedule_direct_end_date: 'required',
            city: 'required',
            district: 'required',
            work_related_details: 'required',
            // direct_input: 'required',
        }
    },

    changeProjectApplicantStatus: {
        rules: {
            status: 'required|in:' + ProjectApplicationService.ALL_STATUS,
            applicant_id: 'required|integer',
        }
    },

    applyForProjectApplication: {
        rules: {
            wage_type: 'required|in:' + ProjectApplicationService.WAGE_TYPE_STATUS,
            suggested_amount : 'required',
        }
    }
}