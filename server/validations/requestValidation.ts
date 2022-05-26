import { RequestService } from "../services";

export default {
    createRequest: {
        rules: {
            registration_type: 'required',
            to_member_id: 'required',
            wage_type: 'required|in:hourly,daily,monthly',
            amount: 'required',
            is_negotiable: 'required|in:yes,no',
            message_id: 'required',
        }
    },

    changeStatus: {
        rules: {
            status: 'required|in:' + RequestService.ALL_STATUS,
            registration_type: 'required',
        }
    }
}