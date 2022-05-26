export default {
    createMember: {
        rules: {
            name: 'required',
            email: 'required|email',
            password: ['required', 'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/i'],
        },
        messages: {
            "regex.password": "Passwords must be a combination of alphabets, numbers, special characters (6 or more characters)."
        }
    },

    updateMember: {
        rules: {
            name: 'required',
            email: 'required|email',
        }
    },

    deleteReportedMember: {
        rules: {
            reported_types: 'required|array',
        },
        messages: {
            "array.reported_types": "This filed must be array",
        }
    }
}