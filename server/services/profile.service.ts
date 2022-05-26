import { isArray } from 'lodash';
import {
    ClientProfileImageService,
    ClientProfileIntroductoryImageService,
    ClientProfileService,
    DistrictService,
    ProvinceService,
    SideCharacterProfileImageService,
    SideCharacterProfilePortfolioService,
    SideCharacterProfileService
} from '.'
import * as CONSTANT from '../constants'
import { ClientProfileOutput } from '../models/clientProfile';
import { ClientProfileIntroductoryImageOutput } from '../models/clientProfileIntroductoryImage';
import { SideCharacterProfileOutput } from '../models/sideCharacterProfile';
import { sideCharacterProfilePortfolioOutput } from '../models/sideCharacterProfilePortfolio';
import { getImagePath, getNotificationTypesByRegistrationType, getTotalUnReadNotifications, isEmpty, profileInfo, saveFile, _json } from '../utils/helper';

export type ProfileOutput = SideCharacterProfileOutput | ClientProfileOutput;
export type RelatedImageOutput = sideCharacterProfilePortfolioOutput | ClientProfileIntroductoryImageOutput;

export default class ProfileService {

    public static PROFESSION_DEVELOPMENT = 'development';
    public static PROFESSION_DESIGN = 'design';
    public static PROFESSION_MARKETING = 'marketing';
    public static PROFESSION_OTHER = 'other';

    public static DESIRED_DATE_WEEKDAYS = 'weekdays';
    public static DESIRED_DATE_WEEKEND = 'weekend';
    public static DESIRED_DATE_WEEKDAYS_WEEKEND = 'weekdays-weekend';

    public static DESIRED_TIME_MORNING = 'morning';
    public static DESIRED_TIME_AFTERNOON = 'afternoon';
    public static DESIRED_TIME_EVENING = 'evening';

    public static DESIRED_PROJECT_TYPE_SHORT_TERM = 'short-term';
    public static DESIRED_PROJECT_TYPE_LONG_TERM = 'long-term';

    public static INSURANCE_STATUS_AVAILABLE = 'available';
    public static INSURANCE_STATUS_UNAVAILABLE = 'unavailable';

    public static DESIRED_WORK_TYPE_WORKFROM_OFFICE = 'workfrom-office';
    public static DESIRED_WORK_TYPE_WORKFROM_HOME = 'workfrom-home';

    public static ALL_PROFESSIONS = [
        this.PROFESSION_DEVELOPMENT,
        this.PROFESSION_DESIGN,
        this.PROFESSION_MARKETING,
        this.PROFESSION_OTHER
    ]

    public static PROFESSIONS_MAPPING = [
        [this.PROFESSION_DEVELOPMENT] = "Development",
        [this.PROFESSION_DESIGN] = "Design",
        [this.PROFESSION_MARKETING] = "Marketing",
        [this.PROFESSION_OTHER] = "Other"
    ]

    public static ALL_DESIRED_DATE = [
        this.DESIRED_DATE_WEEKDAYS,
        this.DESIRED_DATE_WEEKEND,
        this.DESIRED_DATE_WEEKDAYS_WEEKEND,
    ]

    public static ALL_DESIRED_TIME = [
        this.DESIRED_TIME_MORNING,
        this.DESIRED_TIME_AFTERNOON,
        this.DESIRED_TIME_EVENING,
    ]

    public static ALL_DESIRED_PROJECT_TYPE = [
        this.DESIRED_PROJECT_TYPE_SHORT_TERM,
        this.DESIRED_PROJECT_TYPE_LONG_TERM,
    ]

    public static ALL_INSURANCE_STATUS = [
        this.INSURANCE_STATUS_AVAILABLE,
        this.INSURANCE_STATUS_UNAVAILABLE,
    ]

    public static ALL_DESIRED_WORK_TYPE = [
        this.DESIRED_WORK_TYPE_WORKFROM_OFFICE,
        this.DESIRED_WORK_TYPE_WORKFROM_HOME,
    ]

    public sideCharacterProfileImgService = new SideCharacterProfileImageService()
    public sideCharacterProfilePortfolioService = new SideCharacterProfilePortfolioService()
    public clientProfileIntroductoryImageService = new ClientProfileIntroductoryImageService()
    public sideCharacterProfileService = new SideCharacterProfileService()
    public clientProfileService = new ClientProfileService()
    public clientProfileImgService = new ClientProfileImageService()
    public provinceService = new ProvinceService()
    public districtService = new DistrictService()

    public sendPhoneVerificationCode = async (params: { phone: number, registration_type: number, member_id: number }): Promise<void> => {
        const { phone, registration_type, member_id } = params;
        let code: number = 123456;
        const profileData = {
            phone_verification_code: code,
            member_id: member_id
        }
        const filter: any = { where: { member_id: member_id } }
        let profileService: any;
        if (registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) {
            profileService = await this.sideCharacterProfileService;
        } else {
            profileService = await this.clientProfileService;
        }
        return await profileService.createOrUpdate(profileData, filter)
    }

    public findByMemberId = async (memberId: number, registrationType: number): Promise<ProfileOutput> => {
        if (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) {
            return await this.sideCharacterProfileService.getSideCharacterByMemberId(memberId);
        }
        return await this.clientProfileService.getClientProfileByMemberId(memberId);
    }

    public findProfile = async (filter: any, registrationType: number): Promise<ProfileOutput> => {
        if (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) {
            return await this.sideCharacterProfileService.findProfile(filter);
        }
        return await this.clientProfileService.findProfile(filter);
    }

    public update = async (profilePayload: any, filter: any, registrationType: number): Promise<void> => {
        if (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) {
            return await this.sideCharacterProfileService.update(profilePayload, filter);
        }
        return await this.clientProfileService.update(profilePayload, filter);
    }

    public uploadRelatedImages = async (relatedImages: any, registrationType: number, profile: ProfileOutput): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                let uploadType: string;
                let profile_id: string;
                if (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) {
                    uploadType = 'portfolio';
                    profile_id = 'side_character_profile_id';
                } else {
                    uploadType = 'introductory';
                    profile_id = 'client_profile_id';
                }

                if (!isArray(relatedImages)) {
                    relatedImages = [relatedImages];
                }

                for (const images of relatedImages) {
                    await saveFile(images, uploadType)
                        .then(async (files: any) => {
                            let imgData: any = {
                                [profile_id]: profile.id,
                                file_name: files.file_name,
                                original_file_name: images.name,
                                file_type: images.mimetype,
                                file_path: files.upload_path,
                            }
                            try {
                                if (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) {
                                    await this.sideCharacterProfilePortfolioService.create([imgData]);
                                } else {
                                    await this.clientProfileIntroductoryImageService.create(imgData);
                                }
                            } catch (error) {
                                reject(error)
                            }
                        }).catch((err: Error) => reject(err));
                }

                let portfolioData: any = await this.findRelatedImagesByProfileId(profile.id, registrationType)
                let data: any = { [uploadType]: portfolioData };
                resolve(data);
            } catch (error: any) {
                reject(error)
            }
        })
    }

    public findRelatedImagesByProfileId = async (profileId: number, registrationType: number): Promise<any> => {
        let filter: any;
        let profileData: any;
        if (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) {
            filter = { where: { 'side_character_profile_id': profileId } }
            profileData = await this.sideCharacterProfilePortfolioService.findByProfileId(filter);
        } else {
            filter = { where: { 'client_profile_id': profileId } }
            profileData = await this.clientProfileIntroductoryImageService.findByProfileId(filter);
        }
        return profileData;
    }

    public findRelatedImagesById = async (Id: number, registrationType: number): Promise<RelatedImageOutput> => {
        if (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) {
            return await this.sideCharacterProfilePortfolioService.findById(Id);
        }
        return await this.clientProfileIntroductoryImageService.findById(Id);
    }

    public destroyRelatedImages = async (filter: any, relatedImages: any, registrationType: number): Promise<RelatedImageOutput> => {
        if (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) {
            return await this.sideCharacterProfilePortfolioService.destroy(filter, relatedImages);
        }
        return await this.clientProfileIntroductoryImageService.destroy(filter, relatedImages);
    }

    public uploadProfilePicture = async (profileImages: any, registrationType: number, profile: ProfileOutput): Promise<RelatedImageOutput> => {
        return new Promise(async (resolve, reject) => {
            await saveFile(profileImages, 'profile_image')
                .then(async (files: any) => {
                    let profileImageData: any = {
                        file_name: files.file_name,
                        original_file_name: profileImages.name,
                        file_type: profileImages.mimetype,
                        file_path: files.upload_path,
                    }

                    if (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) {
                        profileImageData = { ...profileImageData, side_character_profile_id: profile.id }
                        profileImages = await this.sideCharacterProfileImgService.createOrUpdate(profileImageData);
                    } else {
                        profileImageData = { ...profileImageData, client_profile_id: profile.id }
                        profileImages = await this.clientProfileImgService.createOrUpdate(profileImageData);
                    }
                    resolve(profileImages)
                }).catch((err: Error) => reject(err));
        })
    }

    public findProfileImagesById = async (Id: number, registrationType: number, onlyPath = false): Promise<any> => {
        let filter: any;
        let profileData: any;

        if (registrationType == CONSTANT.MEMBER.SIDE_CHARACTER) {
            filter = { where: { 'side_character_profile_id': Id } }
            profileData = await _json(this.sideCharacterProfileImgService.findByProfileId(filter));
        } else {
            filter = { where: { 'client_profile_id': Id } }
            profileData = await _json(this.clientProfileImgService.findByProfileId(filter));
        }

        if (onlyPath && !isEmpty(profileData)) {
            return profileData.file_path
        }

        return profileData;
    }

    public findProfileImagesByMemberId = async (filter: any, registrationType: number): Promise<any> => {
        let profile: any = await _json(this.findProfile(filter, registrationType));
        if (!isEmpty(profile)) {
            return await this.findProfileImagesById(profile.id, registrationType, true);
        }
        return profile;
    }

    /* TODO refactoring filterProfessions*/
    public filterProfessions = async (professions: any): Promise<any> => {
        professions = professions.split(',')

        if ((!isEmpty(professions))) {
            // professions = await professions.map((profession: any, i: number) => {
            //     return ProfileService.PROFESSIONS_MAPPING[i]
            // })

            let professionsData = [];
            for await (const [key, value] of professions) {
                professionsData.push(ProfileService.PROFESSIONS_MAPPING[key])
            }
            return professionsData
        }
        return professions;
    }

    public getLocationWithNameById = async (locations: any): Promise<any> => {
        return new Promise(async (resolve, reject) => {
            let locationData: any[] = [];
            if (isEmpty(locations)) {
                resolve(locationData);
            }

            try {
                for (const location of locations) {
                    let province: any = await this.provinceService.getProvinceById(location.city);
                    let district: any = await _json(this.districtService.getDistrictById(location.district));

                    locationData.push({
                        ...location,
                        city_name: province && province.name || null,
                        district_name: district && district.name || null
                    })

                }
                resolve(locationData);
            } catch (error) {
                reject(error)
            }
        })
    }

    public switchAccount = async (memberId: any, registration_type: any): Promise<any> => {
        let profile: any;
        let filter = { where: { member_id: memberId }, include: [CONSTANT.RELATIONSHIP.profile_picture] };
        let payload: any = { member_id: memberId };
        if (registration_type == CONSTANT.MEMBER.SIDE_CHARACTER) {
            profile = await _json(this.sideCharacterProfileService.findOrCreate(payload, filter))
        } else {
            profile = await _json(this.clientProfileService.findOrCreate(payload, filter))
        }

        if (!isEmpty(profile)) {
            profile.profile_picture = isEmpty(profile.profile_picture) ? null : profile.profile_picture.file_path;
        }

        let notificationTypes = getNotificationTypesByRegistrationType(registration_type)
        let total_un_read_notifications = await getTotalUnReadNotifications(notificationTypes, memberId)

        return {
            registration_type,
            profile,
            total_un_read_notifications,
            profile_info: await profileInfo(memberId)
        }
    }
}