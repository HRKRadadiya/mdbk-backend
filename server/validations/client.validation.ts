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
    
    editProfileStep2:{
        // rules : {
        //     name: 'required',
        //     introduction: 'required',
        //     contact_information: 'required',
        //     profession: 'required',
        //     registation_number :  'required',
        //     foundation_year : 'required',
        //     representative_name : 'required',
        //     total_employees : 'required'
        // }
    },
    //  celebrate({
    //     [Segments.BODY]: Joi.object().keys({
    //         // company: Joi.object().keys({
    //         //     name: Joi.string().required(),
    //         //     introduction: Joi.string().required(),
    //         //     contact_information: Joi.string().required(),
    //         //     profession: "abc, abc,lll",
    //         //     registation_number: Joi.string().required(),
    //         //     foundation_year: Joi.string().required(),
    //         //     representative_name: Joi.string().required(),
    //         //     total_employees: Joi.string().required(),
    //         // }).required(),
    //     }).options({ abortEarly: false, allowUnknown: true }),
    // }),
    editProfileStep3: {
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