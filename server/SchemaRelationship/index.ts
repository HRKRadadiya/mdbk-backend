import { Sequelize } from "sequelize"
import { RELATIONSHIP } from "../constants"
import {
    ClientProfile,
    ClientProfileCompany,
    ClientProfileCompanyField,
    ClientProfileCompanyHastag,
    ClientProfileCompanyLocation,
    ClientProfileField,
    ClientProfileImage,
    ClientProfileIntroductoryImage,
    ClientProfileLocation,
    CoinsUseHistory,
    Member,
    Message,
    MyLike,
    PaymentHistory,
    Project,
    ProjectApplication,
    ProjectImage,
    Request,
    SearchOption,
    SearchOptionField,
    SearchOptionLocation,
    SearchOptionProfession,
    SideCharacterProfile,
    SideCharacterProfileField,
    SideCharacterProfileImage,
    SideCharacterProfileLocation,
    SideCharacterProfilePortfolio,
    SideCharacterProfileWorkExperience
} from "../models"
import Forum from "../models/forum"
import ForumImage from "../models/forumImage"
import ForumComments from "../models/forum_comments"
import ForumHashtag from "../models/forum_hashtag"
import ForumLink from "../models/forum_link"
import ForumUpDownVote from "../models/forum_updown_vote"
import { sideCharacter } from "../validations"

const initSchemaRelationship = () => {
    // For Member
    Member.hasOne(SideCharacterProfile, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.side_character_profile
    })

    // For SideCharacterProfile
    SideCharacterProfile.belongsTo(Member, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.member
    })

    SideCharacterProfile.hasMany(SideCharacterProfileField, {
        foreignKey: 'side_character_profile_id',
        as: RELATIONSHIP.fields
    })

    SideCharacterProfile.hasMany(SideCharacterProfileLocation, {
        foreignKey: 'side_character_profile_id',
        as: RELATIONSHIP.locations
    })

    SideCharacterProfile.hasMany(SideCharacterProfileWorkExperience, {
        foreignKey: 'side_character_profile_id',
        as: RELATIONSHIP.experiences
    })

    SideCharacterProfile.hasMany(SideCharacterProfilePortfolio, {
        foreignKey: 'side_character_profile_id',
        as: RELATIONSHIP.portfolios
    })

    SideCharacterProfile.hasOne(SideCharacterProfileImage, {
        foreignKey: 'side_character_profile_id',
        as: RELATIONSHIP.profile_picture
    })

    SideCharacterProfile.hasOne(ProjectApplication, {
        foreignKey: 'applicant_id',
        as: RELATIONSHIP.project_application_profile
    })

    // For SideCharacterProfileField
    SideCharacterProfileField.belongsTo(SideCharacterProfile, {
        foreignKey: 'side_character_profile_id',
        as: RELATIONSHIP.side_character_profile
    })

    // For SideCharacterProfileLocation
    SideCharacterProfileLocation.belongsTo(SideCharacterProfile, {
        foreignKey: 'side_character_profile_id',
        as: RELATIONSHIP.side_character_profile
    })

    // For SideCharacterProfileWorkExperience
    SideCharacterProfileWorkExperience.belongsTo(SideCharacterProfile, {
        foreignKey: 'side_character_profile_id',
        as: RELATIONSHIP.side_character_profile
    })

    // For SideCharacterProfilePortfolio
    SideCharacterProfilePortfolio.belongsTo(SideCharacterProfile, {
        foreignKey: 'side_character_profile_id',
        as: RELATIONSHIP.side_character_profile
    })

    // For SideCharacterProfileImage
    SideCharacterProfileImage.belongsTo(SideCharacterProfile, {
        foreignKey: 'side_character_profile_id',
        as: RELATIONSHIP.side_character_profile
    })

    /* Client */
    // For Member
    Member.hasOne(ClientProfile, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.client.client_profile
    })

    // For ClientProfile
    ClientProfile.belongsTo(Member, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.member
    })

    ClientProfile.hasMany(ClientProfileField, {
        foreignKey: 'client_profile_id',
        as: RELATIONSHIP.fields
    })

    ClientProfile.hasMany(ClientProfileLocation, {
        foreignKey: 'client_profile_id',
        as: RELATIONSHIP.locations
    })

    ClientProfile.hasOne(ClientProfileCompany, {
        foreignKey: 'client_profile_id',
        as: RELATIONSHIP.client.company
    })

    ClientProfile.hasMany(ClientProfileIntroductoryImage, {
        foreignKey: 'client_profile_id',
        as: RELATIONSHIP.client.introductories
    })

    ClientProfile.hasOne(ClientProfileImage, {
        foreignKey: 'client_profile_id',
        as: RELATIONSHIP.profile_picture
    })

    // For ClientProfileField
    ClientProfileField.belongsTo(ClientProfile, {
        foreignKey: 'client_profile_id',
        as: RELATIONSHIP.client.client_profile
    })

    // For ClientProfileLocation
    ClientProfileLocation.belongsTo(ClientProfile, {
        foreignKey: 'client_profile_id',
        as: RELATIONSHIP.client.client_profile
    })

    // For ClientProfileCompany
    ClientProfileCompany.belongsTo(ClientProfile, {
        foreignKey: 'client_profile_id',
        as: RELATIONSHIP.client.client_profile
    })

    // For ClientProfilePortfolio
    ClientProfileIntroductoryImage.belongsTo(ClientProfile, {
        foreignKey: 'client_profile_id',
        as: RELATIONSHIP.client.client_profile
    })

    // For ClientProfileImage
    ClientProfileImage.belongsTo(ClientProfile, {
        foreignKey: 'client_profile_id',
        as: RELATIONSHIP.client.client_profile
    })


    /* Client Company Relationship */

    ClientProfileCompany.hasMany(ClientProfileCompanyField, {
        foreignKey: 'client_profile_company_id',
        as: RELATIONSHIP.fields
    })

    ClientProfileCompany.hasMany(ClientProfileCompanyLocation, {
        foreignKey: 'client_profile_company_id',
        as: RELATIONSHIP.locations
    })

    ClientProfileCompany.hasMany(ClientProfileCompanyHastag, {
        foreignKey: 'client_profile_company_id',
        as: RELATIONSHIP.client.hashtags
    })

    // For ClientProfileField
    ClientProfileCompanyField.belongsTo(ClientProfileCompany, {
        foreignKey: 'client_profile_company_id',
        as: RELATIONSHIP.client.company
    })

    // // For ClientProfileLocation
    ClientProfileCompanyLocation.belongsTo(ClientProfileCompany, {
        foreignKey: 'client_profile_company_id',
        as: RELATIONSHIP.client.company
    })

    // // For ClientProfileCompany
    ClientProfileCompanyHastag.belongsTo(ClientProfileCompany, {
        foreignKey: 'client_profile_company_id',
        as: RELATIONSHIP.client.company
    })

    //For Coin History
    Member.hasMany(PaymentHistory, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.payment_history
    })

    PaymentHistory.belongsTo(Member, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.member
    })

    //For Coin History
    Member.hasMany(CoinsUseHistory, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.use_coin_history
    })

    CoinsUseHistory.belongsTo(Member, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.member
    })

    //For My Like
    Member.hasMany(MyLike, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.my_like
    })

    MyLike.belongsTo(Member, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.member
    })

    //For Search Option
    Member.hasMany(SearchOption, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.search_option
    })

    SearchOption.belongsTo(Member, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.member
    })

    //For Search Option Fields
    SearchOption.hasMany(SearchOptionField, {
        foreignKey: 'search_option_id',
        as: RELATIONSHIP.fields
    })

    SearchOptionField.belongsTo(SearchOption, {
        foreignKey: 'search_option_id',
        as: RELATIONSHIP.member
    })

    //For Search Option Profession
    SearchOption.hasMany(SearchOptionProfession, {
        foreignKey: 'search_option_id',
        as: RELATIONSHIP.profession
    })

    SearchOptionProfession.belongsTo(SearchOption, {
        foreignKey: 'search_option_id',
        as: RELATIONSHIP.member
    })

    //For Search Option Locations
    SearchOption.hasMany(SearchOptionLocation, {
        foreignKey: 'search_option_id',
        as: RELATIONSHIP.locations
    })

    SearchOptionLocation.belongsTo(SearchOption, {
        foreignKey: 'search_option_id',
        as: RELATIONSHIP.member
    })

    //For Project Images
    Project.hasMany(ProjectImage, {
        foreignKey: 'project_id',
        as: RELATIONSHIP.project_images
    })

    ProjectImage.belongsTo(Project, {
        foreignKey: 'project_id',
        as: RELATIONSHIP.project
    })

    //For Project

    Member.hasMany(Project, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.project
    })

    Project.belongsTo(Member, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.member
    })

    //For Project Applicant
    Project.hasMany(ProjectApplication, {
        foreignKey: 'project_id',
        as: RELATIONSHIP.project_applications
    })

    ProjectApplication.belongsTo(Project, {
        foreignKey: 'project_id',
        as: RELATIONSHIP.project
    })

    // for project applicant side-charcter profile
    ProjectApplication.belongsTo(SideCharacterProfile, {
        foreignKey: 'applicant_id',
        as: RELATIONSHIP.project_applications
    })

    SideCharacterProfile.hasOne(ProjectApplication, {
        foreignKey: 'applicant_id',
        as: RELATIONSHIP.project_applications
    })

    ProjectApplication.belongsTo(SideCharacterProfile, {
        foreignKey: 'applicant_id',
        as: RELATIONSHIP.project_application_profile
    })

    ProjectApplication.belongsTo(Message, {
        foreignKey: 'message_id',
        as: RELATIONSHIP.message
    })

    //for message
    Message.hasOne(Request, {
        foreignKey: 'message_id',
        as: RELATIONSHIP.request
    })

    Request.belongsTo(Message, {
        foreignKey: 'message_id',
        as: RELATIONSHIP.message
    })

    // For forums
    Member.hasOne(Forum, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.forum
    })

    Forum.belongsTo(Member, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.member
    })
    // For forums vote
    Forum.hasMany(ForumUpDownVote, {
        foreignKey: 'forum_id',
        as: RELATIONSHIP.forum_up_down_vote
    })

    ForumUpDownVote.belongsTo(Forum, {
        foreignKey: 'forum_id',
        as: RELATIONSHIP.forum
    })
    // For forums image
    Forum.hasMany(ForumImage, {
        foreignKey: 'forum_id',
        as: RELATIONSHIP.forum_images
    })

    ForumImage.belongsTo(Forum, {
        foreignKey: 'forum_id',
        as: RELATIONSHIP.forum
    })
    // For forums hashtag
    Forum.hasMany(ForumHashtag, {
        foreignKey: 'forum_id',
        as: RELATIONSHIP.forum_hashtags
    })

    ForumHashtag.belongsTo(Forum, {
        foreignKey: 'forum_id',
        as: RELATIONSHIP.forum
    })
    // For forums links
    Forum.hasMany(ForumLink, {
        foreignKey: 'forum_id',
        as: RELATIONSHIP.forum_links
    })

    ForumLink.belongsTo(Forum, {
        foreignKey: 'forum_id',
        as: RELATIONSHIP.forum
    })

    Forum.belongsTo(Forum, {
        foreignKey: 'parent_id',
        as: RELATIONSHIP.parent,
    })
    Forum.hasMany(Forum, {
        foreignKey: 'parent_id',
        as: RELATIONSHIP.child,
    })

    // For forums comment
    Member.hasMany(ForumComments, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.forum_comments
    })

    ForumComments.belongsTo(Member, {
        foreignKey: 'member_id',
        as: RELATIONSHIP.member
    })

    // For forums comment
    Forum.hasMany(ForumComments, {
        foreignKey: 'forum_id',
        as: RELATIONSHIP.forum_comments
    })

    ForumComments.belongsTo(Forum, {
        foreignKey: 'forum_id',
        as: RELATIONSHIP.forum
    })

    ForumComments.belongsTo(ForumComments, {
        foreignKey: 'parent_id',
        as: RELATIONSHIP.parent_comment,
    })
    ForumComments.hasMany(ForumComments, {
        foreignKey: 'parent_id',
        as: RELATIONSHIP.child_comment,
    })

}

export default initSchemaRelationship