import { ProjectService } from "../../services";

export default {
    projectList: {
        rules: {
            page: 'required',
            profession: `in:${ProjectService.ALL_PROFESSIONS}`
        },
        messages: {
            "in.profession": `only ${ProjectService.ALL_PROFESSIONS} is required`
        }
    },
}