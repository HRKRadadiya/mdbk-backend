
export default {
	verifyEmail: {
		rules: {
			email: 'required|email',
			verification_code: 'required',
		}
	},

	registerMember: {
		rules: {
			name: 'required',
			email: 'required|email',
			password: ['required', 'regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/i'],
			confirm_password: 'required|same:password',
			registration_type: 'required'
		},
		messages: {
			"regex.password": "Passwords must be a combination of alphabets, numbers, special characters (6 or more characters)."
		}
	},

	socialAuth: {
		rules: {
			name: 'required',
			email: 'required|email',
			login_type: 'required',
			social_id: 'required'
		}
	},

	resetPasswordLink: {
		rules: {
			email: 'required|email',
		}
	},

	confirmResetPassword: {
		rules: {
			password: 'required',
			token: 'required'
		}
	},

	switchAccount: {
		rules: {
			registration_type: 'required',
		}
	},

	likeUnlike: {
		rules: {
			like_type: 'required',
			source_id: 'required',
		}
	},

	reportUnreport: {
		rules: {
			report_type: 'required',
			source_id: 'required',
		}
	},
}