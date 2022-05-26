import { JoiError } from './../types';
import { isArray } from "lodash"
import { UploadedFile } from 'express-fileupload';
import config from '../config/config';
import moment from 'moment';
import path from 'path';
import fs from 'fs';
import Validator from 'validatorjs';
import { FormErrorsHandler } from '../errorHandler';
import { NextFunction, Response, Request, Application } from 'express';
import { Notification } from '../models';
import { NotificationInput } from '../models/notification';
import { MEMBER, NOTIFICATION_EVENT_TYPE, RELATIONSHIP } from '../constants';
import { Op } from 'sequelize';
import { MemberService, ProfileService } from '../services';




export const isEmpty = (value: any) => {
    if (value == null || value == 'null') {
        return true;
    }
    if (typeof value == "object") {
        return Object.keys(value).length == 0;
    }
    return (
        (isArray(value) && value.length == 0)
        || ((value == undefined || value == 'undefined' || value == null || value == ''))
    )
}

export const checkPath = (args: any[], str: String) => {
    return args.find(value => {
        return value == str
    }) ? true : false;
}

export const getFileName = (args: any[]) => {
    return args.filter((value, i) => i != 0 && i != 1).find(value => {
        return value.includes('.ts')
    });
}

export const generateToken = () => {
    let rand = function () {
        return Math.random().toString(36).substr(2);
    };
    return rand() + rand();
}

export const collectJoiErrors = (err: any) => {
    let errors: any = {};

    try {
        if (err.hasOwnProperty('details')) {
            ['body', 'params', 'query'].forEach((val: string, i: number) => {
                const errorBody: any = err.details.get(val);
                if (errorBody) {
                    errorBody.details.forEach((curErr: JoiError) => {
                        errors[curErr.context.label] = curErr.message.replace(/[\"]/g, '');
                    })
                }
            });
        } else {
            console.log(err);
        }
    } catch (error) {
        errors['message'] = err.message;
    }

    return errors;
}

export const inArray = (value: any, arr: any[]) => {
    return arr.filter((val: any, i: number) => val == value).length != 0
}

export const findDifferentArray = (array1: any, array2: any, field = '') => {

    if (isEmpty(array2)) {
        return array1;
    }
    return array1.filter((element: any, i: number) => {
        // if (isEmpty(array2[i])) {
        //     return true;
        // }
        // if (!isEmpty(field)) {
        //     return element[field] != array2[i][field]
        // } else {
        //     return element != array2[i]
        // }

        return array2.find((ele: any) => {
            if (!isEmpty(field)) {
                return ele[field] == element[field]
            } else {
                return ele == element
            }
        }) ? true : false
    });
}

export const saveFile = (files: UploadedFile, uploadPath = '') => {
    let fileUploadPath = config.file_path + '/images/' + uploadPath;
    let fileName = moment().unix() + Math.floor(1000 + Math.random() * 9000) + '.' + files.name.split('.').pop();;
    return new Promise(async (resolve, reject) => {
        fileUploadPath = fileUploadPath + '/' + fileName;
        files.mv(fileUploadPath, async (err: Error) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    upload_path: '/images/' + uploadPath + '/' + fileName,
                    file_name: fileName
                });
            }
        });
    })
}

export const removeFile = (filePath: string) => {
    return new Promise((resolve, reject) => {
        try {
            filePath = config.file_path + filePath;

            fs.unlinkSync(filePath);
            resolve(true)
        } catch (error) {
            resolve(true)
        }
    })
}

export const getFilePath = (filePath: string) => {
    return config.app_host + filePath;
}

export const getImagePath = (filePath: string) => {
    return rtrim(config.app_host, '/') + filePath;
}

export function requestValidate(validationRulesAndMessages: any) {
    return function (req: Request, res: Response, next: NextFunction) {
        let input: any = {
            ...req.body,
            ...req.query
        };
        let validation = new Validator(input, validationRulesAndMessages.rules, validationRulesAndMessages.messages != undefined ? validationRulesAndMessages.messages : {});
        if (validation.fails()) {
            return next(new FormErrorsHandler(validation.errors.errors))
        }
        next();
    }
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export async function _json(data: any) {
    return await new Promise(async (resolve, reject) => {
        try {
            let dataS: any = await data;
            if (isEmpty(dataS)) {
                resolve([]);
            } else {
                // if (isArray(dataS)) {
                //     resolve(dataS.map((item: any) => item.toJSON()));
                // } else {
                //     resolve(dataS.toJSON());
                // }
                resolve(JSON.parse(JSON.stringify(dataS)))
            }
        } catch (error) {
            reject(error)
        }
    })
}

export async function convertToArray(data: any) {
    let array: any = [];
    if (!isArray(data)) {
        array.push(data)
    } else {
        array = data;
    }
    return array;
}
// export function urlSettings(url: string) {
//     url = url.trim('/');
// }

export function rtrim(str: string, wrd: string) {
    return str.trim().endsWith(wrd) ?
        str.slice(0, -1) :
        str;
};


export function _bool(val: any) {
    return (!isEmpty(val) && (val == true || val == "true")) ? true : false
};

export async function saveNotification(payload: NotificationInput) {
    let notification = null;
    try {
        notification = await Notification.create(payload);
    } catch (error) {
        console.log("============== Notification Error ==============");
        console.log(error);
        console.log("============== Notification Error ==============");
    }
    return notification;
}

export function getNotificationTypesByRegistrationType(registration_type: number) {
    let notificationTypes = [
        NOTIFICATION_EVENT_TYPE.received_interview_request,
        NOTIFICATION_EVENT_TYPE.user_applied_for_project,
        NOTIFICATION_EVENT_TYPE.user_answered_on_your_forum_question,
        NOTIFICATION_EVENT_TYPE.contact_information_request_accepted,
        NOTIFICATION_EVENT_TYPE.contact_information_request_rejected,
    ];
    if (registration_type == MEMBER.SIDE_CHARACTER) {
        notificationTypes = [
            NOTIFICATION_EVENT_TYPE.received_contact_information_request,
            NOTIFICATION_EVENT_TYPE.your_project_application_accepted,
            NOTIFICATION_EVENT_TYPE.user_commented_on_your_forum_answered,
            NOTIFICATION_EVENT_TYPE.interview_request_accepted,
            NOTIFICATION_EVENT_TYPE.interview_request_rejected,
        ]
    }
    return notificationTypes;
}


export async function getTotalUnReadNotifications(notificationTypes: any, to_member_id: number) {
    let where = {
        to_member_id,
        is_read: 'no',
        notification_type: {
            [Op.in]: notificationTypes
        }
    };
    let total_un_read_notifications = await Notification.count({ where })
    return total_un_read_notifications;
}

export async function prettyPrint(obj: any) {
    return JSON.stringify(obj, null, 2);
}

export async function logInfo(payload: { data: any, type: string }) {
    let fileName = moment().format('YYYY_MM_DD') + '.log';
    let dir: string = './logs';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    let filePath = dir + '/' + fileName;;
    let logInfo: any = `${payload.type}\n`;
    logInfo += await prettyPrint(payload.data);
    logInfo += `\n\n`;

    return await fs.appendFile(filePath, logInfo, (err) => {
        if (err instanceof Error) {
            console.log(err);
        }
    });
}

export async function profileInfo(memberId: any) {
    const profileService = new ProfileService();
    const memberService = new MemberService();

    let filter = {
        attributes: ['nick_name', 'id'],
        where: { member_id: memberId },
        include: [RELATIONSHIP.profile_picture]
    };

    let member: any = await memberService.findByMemberId({ attributes: ['name'], where: { id: memberId } })

    return new Promise(async (resolve, reject) => {
        let data: any = {
            side_character_profile: await _json(profileService.findProfile(filter, MEMBER.SIDE_CHARACTER)),
            client_profile: await _json(profileService.findProfile(filter, MEMBER.CLIENT))
        }

        data.side_character_profile.profile_picture = await profilePicturePath(data.side_character_profile)
        data.side_character_profile.name = member.name
        data.client_profile.profile_picture = await profilePicturePath(data.client_profile)
        data.client_profile.name = member.name

        resolve(data)
    })
}

export const profilePicturePath = async (profile: any) => {
    if (!isEmpty(profile)) {
        return !isEmpty(profile.profile_picture) ? profile.profile_picture.file_path : null
    }
    return profile;
}

