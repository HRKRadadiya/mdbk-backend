export const NODE_MODE = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
}

export const DEFAULT_ORDER = {
    FIELD: 'id',
    TYPE: 'DESC',
}

export const ADMIN_DEFAULT_ORDER = {
    FIELD: 'id',
    TYPE: 'DESC',
}

export const MEMBER = {
    SIDE_CHARACTER: 2,
    CLIENT: 1,
}

export const MEMBER_TYPE = {
    SIDE_CHARACTER: 'side-character',
    CLIENT: 'client',
}

export const MEMBER_PROFILE: any = {
    '1': 'client',
    '2': 'side-character',
}

export const YES_NO = {
    YES: 'yes',
    NO: 'no',
}

export const PROFILE_PROGRESS = {
    [MEMBER.SIDE_CHARACTER]: {
        step1: 65,
        step2: 5,
        step3: 30
    },
    [MEMBER.CLIENT]: {
        step1: 65,
        step2: 5,
        step3: 30
    }
}
export const LOGO = "data:image/png;base64,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"


export const RELATIONSHIP = {
    side_character_profile: 'side_character_profile',
    client_profile: 'client_profile',
    client_profile_company: 'client_profile_company',
    member: 'member',
    fields: 'fields',
    profession: 'profession',
    locations: 'locations',
    experiences: 'experiences',
    portfolios: 'portfolios',
    profile_picture: 'profile_picture',
    client: {
        client_profile: 'client_profile',
        company: 'company',
        introductories: 'introductories',
        hashtags: 'hashtags'
    },
    payment_history: 'payment_history',
    use_coin_history: 'use_coin_history',
    my_like: 'my_like',
    search_option: 'search_option',
    project: 'project',
    project_applications: 'project_applications',
    project_application_profile: 'project_application_profile',
    message: 'message',
    project_images: 'project_images',
    request: 'request',
    messages: 'messages',
    forum: 'forum',
    forum_up_down_vote: 'forum_up_down_vote',
    forum_images: 'forum_images',
    forum_hashtags: 'forum_hashtags',
    forum_links: 'forum_links',
    parent: 'parent',
    child: 'child',
    parent_comment: 'parent_comment',
    child_comment: 'child_comment',
    forum_comments: 'forum_comments',
}

export const COINS = {
    request_coins: 1000,
    bonus_coin_registration: 5000
}

export const REQUESTS = {
    total_free_request: 2,
}

export const BASIC_VALIDATION = {
    profile_needed_progress: 80,
}

export const NOTIFICATION_EVENT_TYPE = {
    // client
    'received_interview_request': 'received_interview_request',
    'user_applied_for_project': 'user_applied_for_project',
    'user_answered_on_your_forum_question': 'user_answered_on_your_forum_question',
    'contact_information_request_accepted': 'contact_information_request_accepted',
    'contact_information_request_rejected': 'contact_information_request_rejected',

    //side character
    'received_contact_information_request': 'received_contact_information_request',
    'your_project_application_accepted': 'your_project_application_accepted',
    'user_commented_on_your_forum_answered': 'user_commented_on_your_forum_answered',
    'interview_request_accepted': 'interview_request_accepted',
    'interview_request_rejected': 'interview_request_rejected',
}