export default {
    editProfileStep1: {
        rules: {
            nick_name: 'required',
            fields: 'array|max:3|required',
            profession: 'array|min:1|required',
            introduction: 'required',
        },
        messages: {
            "array.fields" : "This filed must be array",
            "array.profession" : "This filed must be array"
        }
    },

    editProfileStep2 : {
        rules: {
            'experience.*.id': 'numeric|required',
            'experience.*.company_name': 'required',
            'experience.*.position': 'required',
            'experience.*.profession' :  'required',
            'experience.*.employment_start_date' : 'required',
            'experience.*.employment_end_date' : 'required'
        },
        messages: {
            "numeric.experience.0.id" : "The id must be a number.",
            "required.experience.0.id" : "The id field is required.",
            "required.experience.0.company_name" : "The company name field is required.",
            "required.experience.0.position" : "The position field is required.",
            "required.experience.0.profession" : "The profession field is required.",
            "required.experience.0.employment_start_date" : "The employment start date field is required.",
            "required.experience.0.employment_end_date" : "The employment end date field is required."
        }
    },

    editProfileStep3 : {
        rules: {
            desired_date: 'required|in:weekdays,weekend,weekdays-weekend',
            desired_time: 'required|in:morning,afternoon,evening',
            desired_project_type: 'required|in:short-term,long-term',
            insurance_status: 'required|in:available,unavailable',
            desired_work_type: 'required|in:workfrom-office,workfrom-home',
        },
        messages: {
            "in.desired_date" : "Only add weekdays,weekend or weekdays-weekend in desired date",
            "in.desired_time" : "Only add morning,afternoon or evening in desired time",
            "in.desired_project_type" : "Only add short-term or long-term in desired project type",
            "in.insurance_status" : "Only add available or unavailable in insurance status",
            "in.desired_work_type" : "Only add workfrom-office or workfrom-home in desired work type",
        }
    },
}