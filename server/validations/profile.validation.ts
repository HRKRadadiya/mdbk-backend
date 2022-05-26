export default {
    sendVerificationCode: {
        rules: {
            phone: 'required',
            registration_type: 'required'
        }
    },

    confirmVerificationCode: {
        rules: {
            phone_verification_code: 'required',
            registration_type: 'required'
        }
    },

    uploadRelatedImages: {
        rules: {
            registration_type: 'required'
        }
    },

    removeRelatedImages: {
        rules: {
            registration_type: 'required'
        }
    },

    uploadProfileImages: {
        rules: {
            registration_type: 'required'
        }
    },

    changeNotificationSetting: {
        rules: {
            status: 'boolean',
        }
    },

    editInformationSetting: {
        rules: {
            name: 'required',
            email: 'required|email',
            password: ['required', 'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/i'],
        },
        messages: {
            "regex.password": "Passwords must be a combination of alphabets, numbers, special characters (6 or more characters)."
        }
    },
}