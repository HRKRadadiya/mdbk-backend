export default {
    login: {
        rules:  {
            email: 'required|email',
            password: 'required',
        }
    },

    validateEmailOnly: {
        rules:  {
            email: 'required|email',
        }
    },
    
    validatePageOnly: {
        rules:  {
            page: 'required',
        }
    },
}