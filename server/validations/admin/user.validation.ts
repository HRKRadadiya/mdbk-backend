export default {
	createUser: {
        rules: {
            name: 'required',
            user_name: 'required',
            email: 'required|email',
            password:'required|min:4|max:8',
            phone: 'required',
			employee_type: 'required',
			role: 'required',
        }
    },

	updateUser:  {
        rules: {
            name: 'required',
            user_name: 'required',
            email: 'required|email',
            phone: 'required',
			employee_type: 'required',
			role: 'required',
        }
    },
}