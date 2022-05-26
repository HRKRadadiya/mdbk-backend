import { BCoinPackages, ClientProfile, Member, SideCharacterProfile } from '../models';
import Forum from '../models/forum';
import faker from 'faker';
import { isEmpty, _json } from '../utils/helper';
import _ from 'lodash';
import { MEMBER, MEMBER_PROFILE, MEMBER_TYPE, RELATIONSHIP } from '../constants';
import ForumHashtagService from '../services/forumHashtag.service';
import ForumLinkService from '../services/forumLink.service';
import ForumService from '../services/forum.service';
import ForumCommentsService from '../services/forumComments.service';
import initSchemaRelationship from '../SchemaRelationship';
import { MemberService, ProfileService } from '../services';
import { Op } from 'sequelize';
import ForumHashtag from '../models/forum_hashtag';
import ForumComments from '../models/forum_comments';
import ForumLink from '../models/forum_link';
import ForumReport from '../models/forumReport';

export default class ForumSeeder {
    public static forumHashtagService = new ForumHashtagService()
    public static formsLinkService = new ForumLinkService()
    public static forumCommentService = new ForumCommentsService()
    public static memberService = new MemberService()
    public static profileService = new ProfileService()

    static async up() {
        initSchemaRelationship();


        let members: any = await _json(this.memberService.getAllUser());

        let membersId: any = _.map(members, 'id')
        let profileTypes = _.values(MEMBER_PROFILE);

        for (let index = 1; index <= this.randomNumber(50, 60); index++) {
            let sourceType: any = _.shuffle(profileTypes)[Math.floor(Math.random() * profileTypes.length)];
            let memberId: any = _.shuffle(membersId)[Math.floor(Math.random() * membersId.length)]
            let member = members.find((item: any) => item.id == memberId);
            let [profileType, profile]: any = await this.findProfile(memberId, sourceType)
            if (isEmpty(profile)) {
                break;
            }

            let forumQus: any = await this.createForum({
                member_id: memberId,
                text: faker.lorem.sentence(1),
                link: 'https://www.google.co.in/',
                category: _.shuffle(ForumService.ALL_CATEGORYS)[Math.floor(Math.random() * ForumService.ALL_CATEGORYS.length)],
                source_type: profileType,
                source_id: profile.id,
                parent_id: 0
            })

            for (let index = 1; index <= this.randomNumber(2, 4); index++) {
                let memberId: any = _.shuffle(membersId)[Math.floor(Math.random() * membersId.length)]
                let member = members.find((item: any) => item.id == memberId);
                let sourceType: any = _.shuffle(profileTypes)[Math.floor(Math.random() * profileTypes.length)];
                let [profileType, profile]: any = await this.findProfile(memberId, sourceType)
                if (isEmpty(profile)) {
                    break;
                }

                let ans: any = await this.createForum({
                    member_id: _.shuffle(membersId)[Math.floor(Math.random() * membersId.length)],
                    text: faker.lorem.sentence(1),
                    category: forumQus.category,
                    source_type: profileType,
                    source_id: profile.id,
                    parent_id: forumQus.id
                })
                await this.addLinks(ans.id);
                await this.addHashtags(ans.id);
                for (let index = 1; index <= this.randomNumber(2, 3); index++) {
                    let memberId: any = _.shuffle(membersId)[Math.floor(Math.random() * membersId.length)]
                    let member = members.find((item: any) => item.id == memberId);
                    let sourceType: any = _.shuffle(profileTypes)[Math.floor(Math.random() * profileTypes.length)];
                    let [profileType, profile]: any = await this.findProfile(memberId, sourceType)
                    if (isEmpty(profile)) {
                        break;
                    }

                    let forumData: any = {
                        member_id: _.shuffle(membersId)[Math.floor(Math.random() * membersId.length)],
                        forum_id: ans.id,
                        text: faker.lorem.sentence(5),
                        source_type: profileType,
                        source_id: profile.id,
                    }
                    let parentComment: any = await this.forumCommentService.create(forumData)
                    for (let index = 1; index <= this.randomNumber(2, 3); index++) {
                        let memberId: any = _.shuffle(membersId)[Math.floor(Math.random() * membersId.length)]
                        let sourceType: any = _.shuffle(profileTypes)[Math.floor(Math.random() * profileTypes.length)];
                        let [profileType, profile]: any = await this.findProfile(memberId, sourceType)
                        if (isEmpty(profile)) {
                            break;
                        }

                        let forumData: any = {
                            member_id: _.shuffle(membersId)[Math.floor(Math.random() * membersId.length)],
                            forum_id: parentComment.forum_id,
                            text: faker.lorem.sentence(5),
                            source_type: profileType,
                            source_id: profile.id,
                            parent_id: parentComment.id
                        }
                        await this.forumCommentService.create(forumData)
                    }
                }
            }
        }
    }

    static async down() {
        await ForumHashtag.destroy({ truncate: true, cascade: true });
        await ForumComments.destroy({ truncate: true, cascade: true });
        await ForumLink.destroy({ truncate: true, cascade: true });
        await ForumReport.destroy({ truncate: true, cascade: true });
        await Forum.destroy({ truncate: true, cascade: true });
    }

    static randomNumber(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }

    static async createForum(payload: any) {
        return await Forum.create(payload)
    }

    static async addLinks(forum_id: number) {
        for (let index = 1; index <= this.randomNumber(1, 6); index++) {
            await this.formsLinkService.create({
                forum_id: forum_id,
                link: faker.internet.url()
            })
        }
    }

    static async addHashtags(forum_id: number) {
        for (let index = 1; index <= this.randomNumber(1, 6); index++) {
            await this.forumHashtagService.create({
                forum_id,
                name: faker.internet.url()
            })
        }
    }

    static async findProfile(memberId: any, profileType: any) {
        let registrationType: any = (profileType == 'client') ? MEMBER.CLIENT : MEMBER.SIDE_CHARACTER
        let profile: any = await _json(this.profileService.findProfile({
            where: {
                member_id: memberId
            }
        }, registrationType));

        if (isEmpty(profile)) {
            registrationType = (registrationType == MEMBER.CLIENT) ? MEMBER.SIDE_CHARACTER : MEMBER.CLIENT
            profileType = MEMBER_PROFILE[registrationType]
            profile = await _json(this.profileService.findProfile({
                where: {
                    member_id: memberId
                }
            }, registrationType));
        }
        return [profileType, profile]
    }
}