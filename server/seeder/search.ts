import bcrypt from 'bcryptjs'
import faker from 'faker';
import _ from 'lodash';
import moment from 'moment';

import { _json } from '../utils/helper';
import { MemberOutput } from '../models/member';
import {
    ProfileService,
    ClientProfileCompanyFieldService,
    ClientProfileCompanyHastagService,
    ClientProfileCompanyLocationService,
    ClientProfileCompanyService,
    ClientProfileFieldService,
    ClientProfileImageService,
    ClientProfileIntroductoryImageService,
    ClientProfileLocationService,
    ClientProfileService,
    DistrictService,
    MemberService,
    SideCharacterProfileFieldService,
    SideCharacterProfileImageService,
    SideCharacterProfileLocationService,
    SideCharacterProfilePortfolioService,
    SideCharacterProfileService,
    SideCharacterProfileWorkExperienceService
} from '../services';
import { ClientProfileCompanyField, ClientProfileCompanyHastag, ClientProfileField, SideCharacterProfileField } from '../models';

export default class SearchSeeder {

    public static districtService = new DistrictService()
    public static profileService = new ProfileService()
    public static memberService = new MemberService()
    public static sideCharacterProfileService = new SideCharacterProfileService()
    public static sideCharacterProfileFieldService = new SideCharacterProfileFieldService()
    public static sideCharacterProfileLocationService = new SideCharacterProfileLocationService()
    public static sideCharacterProfileImgService = new SideCharacterProfileImageService()
    public static sideCharacterProfilePortfolioService = new SideCharacterProfilePortfolioService()
    public static sideCharacterProfileWorkExperienceService = new SideCharacterProfileWorkExperienceService()

    /* client */
    public static clientProfileService = new ClientProfileService()
    public static clientProfileFieldService = new ClientProfileFieldService()
    public static clientProfileCompanyLocationService = new ClientProfileCompanyLocationService()
    public static clientProfileIntroductoryImageService = new ClientProfileIntroductoryImageService()
    public static clientProfileCompanyService = new ClientProfileCompanyService()
    public static clientProfileCompanyHastagService = new ClientProfileCompanyHastagService()
    public static clientProfileCompanyFieldService = new ClientProfileCompanyFieldService()
    public static clientProfileLocationService = new ClientProfileLocationService()
    public static clientProfileImageService = new ClientProfileImageService()

    static async up() {
        const hashedPassword: any = await bcrypt.hash('12345678', 8);
        const districtList: any = await _json(this.districtService.getAllDistrict());

        for (let index = 1; index <= this.randomNumber(50, 150); index++) {
            const profileType = this.randomNumber(1, 3);
            let memberData: any = {
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: hashedPassword,
                verification_code: 123456,
                email_verified: 'yes'
            }
            let step_completion: any = {
                side_character: [],
                client: []
            };
            if (profileType == 1 || profileType == 3) {
                memberData.side_character_profile_progress = 100;
                step_completion.side_character.push(1);
                step_completion.side_character.push(2);
                step_completion.side_character.push(3);
            }
            if (profileType == 2 || profileType == 3) {
                memberData.client_profile_progress = 100;
                step_completion.client.push(1);
                step_completion.client.push(2);
                step_completion.client.push(3);
            }
            memberData.step_completion = JSON.stringify(step_completion)

            // create member
            await this.memberService.createMember(memberData).then(async (member: MemberOutput) => {
                switch (profileType) {
                    case 1:
                        await this.__dumpClientAndSideCharacter(member, true, districtList);
                        break;

                    case 2:
                        await this.__dumpClientAndSideCharacter(member, false, districtList);
                        break;

                    case 3:
                        await this.__dumpClientAndSideCharacter(member, true, districtList);
                        await this.__dumpClientAndSideCharacter(member, false, districtList);
                        break;
                }
            }).catch((err) => console.log("catch1 ", err));
        }
    }

    static async down() {
        // nothing
    }


    // page level helper
    static async __dumpClientAndSideCharacter(member: any, isSideCharacter: boolean, districtList: any[]) {

        let phone: string = Math.floor(Math.random() * 90000) + 10000000000 + "";

        let filter: any = {
            where: {
                member_id: member.id
            }
        };
        let basicProfileData: any = {
            member_id: member.id,
            nick_name: faker.name.findName(),
            introduction: faker.lorem.paragraph(),
            phone,
            is_phone_verified: faker.datatype.boolean(),
            profession: _.shuffle(ProfileService.ALL_PROFESSIONS)[Math.floor(Math.random() * ProfileService.ALL_PROFESSIONS.length)],
            homepage_link: faker.internet.url(),
            desired_date: _.shuffle(ProfileService.ALL_DESIRED_DATE)[Math.floor(Math.random() * ProfileService.ALL_DESIRED_DATE.length)],
            desired_time: _.shuffle(ProfileService.ALL_DESIRED_TIME)[Math.floor(Math.random() * ProfileService.ALL_DESIRED_TIME.length)],
            desired_project_type: _.shuffle(ProfileService.ALL_DESIRED_PROJECT_TYPE)[Math.floor(Math.random() * ProfileService.ALL_DESIRED_PROJECT_TYPE.length)],
            insurance_status: _.shuffle(ProfileService.ALL_INSURANCE_STATUS)[Math.floor(Math.random() * ProfileService.ALL_INSURANCE_STATUS.length)],
            desired_work_type: _.shuffle(ProfileService.ALL_DESIRED_WORK_TYPE)[Math.floor(Math.random() * ProfileService.ALL_DESIRED_WORK_TYPE.length)],
        };
        let profile: any;
        if (isSideCharacter) {
            basicProfileData.is_experienced = faker.datatype.boolean() ? 'yes' : 'no';
            // create side character profile 
            profile = await this.sideCharacterProfileService.findOrCreate(basicProfileData, filter)
            if (basicProfileData.is_experienced == "yes") {
                let positions = ["Assistant Manager", "Business Manager", "Human Resources"];
                let professions = ["Web Developer", "Web Designer", "Android Developer", "Full Stack Developer"];
                let workExperience: any = [];
                for (let index = 1; index < this.randomNumber(1, 5); index++) {
                    let startDate: any = moment().subtract(this.randomNumber(4500, 5000), "days");
                    let endDate: any = moment(startDate).add(this.randomNumber(50, 500), 'days').format('YYYY-MM');
                    workExperience.push({
                        id: 0,
                        company_name: faker.company.companyName(),
                        position: _.shuffle(positions)[Math.floor(Math.random() * positions.length)],
                        profession: _.shuffle(professions)[Math.floor(Math.random() * professions.length)],
                        employment_start_date: moment(startDate).format('YYYY-MM'),
                        employment_end_date: endDate,
                        side_character_profile_id: profile.id
                    });
                }
                await this.sideCharacterProfileWorkExperienceService.createOrUpdate(workExperience)
            }

            // add side character locations
            let locations = this.locations(districtList, faker.datatype.boolean()).map((location: any) => {
                return {
                    ...location,
                    side_character_profile_id: profile.id,
                }
            })
            await this.sideCharacterProfileLocationService.createOrUpdateLocation(locations);

            // add side character fields
            let fields: any = this.fields().map((field: any) => {
                return {
                    side_character_profile_id: profile.id,
                    name: field
                }
            })
            await SideCharacterProfileField.bulkCreate(fields)
            //  this.sideCharacterProfileFieldService.create(fields);

        } else {
            basicProfileData.is_company = faker.datatype.boolean() ? 'yes' : 'no';
            // create client profile 
            profile = await this.clientProfileService.findOrCreate(basicProfileData, filter)

            let contact_information: string = Math.floor(Math.random() * 90000) + 10000000000 + "";

            // create client company
            if (basicProfileData.is_company == "yes") {
                let company: any = {
                    client_profile_id: profile.id,
                    name: faker.name.findName(),
                    introduction: faker.lorem.paragraph(),
                    contact_information,
                    profession: _.shuffle(ProfileService.ALL_PROFESSIONS)[Math.floor(Math.random() * ProfileService.ALL_PROFESSIONS.length)],
                    registation_number: faker.finance.account(),
                    foundation_year: this.randomNumber(1980, 2020),
                    representative_name: faker.name.findName(),
                    total_employees: this.randomNumber(1, 50),
                };
                company = await this.clientProfileCompanyService.createOrUpdate(company);

                // add client company fields
                if (faker.datatype.boolean()) {
                    let hashtags: any = this.hashtags().map((field: any) => {
                        return {
                            client_profile_company_id: company.id,
                            name: field
                        }
                    })
                    // await this.clientProfileCompanyHastagService.create(hashtags);
                    await ClientProfileCompanyHastag.bulkCreate(hashtags)
                }

                // add client company fields
                let fields: any = this.fields().map((field: any) => {
                    return {
                        client_profile_company_id: company.id,
                        name: field
                    }
                })
                // await this.clientProfileCompanyFieldService.create(fields);
                await ClientProfileCompanyField.bulkCreate(fields)

                // add client company locations
                let locations = this.locations(districtList, faker.datatype.boolean()).map((location: any) => {
                    return {
                        ...location,
                        client_profile_company_id: company.id,
                    }
                })
                await this.clientProfileCompanyLocationService.createOrUpdate(locations);
            }

            // add client fields
            let fields: any = this.fields().map((field: any) => {
                return {
                    client_profile_id: profile.id,
                    name: field
                }
            })
            // await this.clientProfileFieldService.create(fields);
            await ClientProfileField.bulkCreate(fields)

            // add client locations
            let locations = this.locations(districtList, faker.datatype.boolean()).map((location: any) => {
                return {
                    ...location,
                    client_profile_id: profile.id,
                }
            })
            await this.clientProfileLocationService.createOrUpdate(locations);
        }
    }

    static randomNumber(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }

    static fields(): any[] {
        let fields: any = [];
        for (let index = 1; index <= 3; index++) {
            fields.push(faker.lorem.word())
        }
        return fields;
    }


    static hashtags(): any[] {
        let fields: any = [];
        for (let index = 1; index <= this.randomNumber(1, 6); index++) {
            fields.push(faker.lorem.word())
        }
        return fields;
    }

    static locations(districtList: any[], onlyOne: boolean): any[] {
        let locations: any = [];
        let _randLocation = _.shuffle(districtList)[Math.floor(Math.random() * districtList.length)];
        locations.push({
            "id": 0,
            "city": _randLocation.province_id,
            "district": _randLocation.id
        });
        if (onlyOne == false) {
            _randLocation = _.shuffle(districtList)[Math.floor(Math.random() * districtList.length)];
            locations.push({
                "id": 0,
                "city": _randLocation.province_id,
                "district": _randLocation.id
            });
        }
        return locations;
    }
}
