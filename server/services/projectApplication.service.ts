import { ProjectApplication } from '../models'
import * as CONSTANT from '../constants'
import { isEmpty } from 'lodash';

export default class ProjectApplicationService {

    public static ACCEPTED_STATUS = 'accepted';
    public static REJECTED_STATUS = 'rejected';
    public static WAITING_STATUS = 'waiting';

    public static HOURLY_STATUS = 'hourly';
    public static DAILY_STATUS = 'daily';
    public static MONTHLY_STATUS = 'monthly';

    public static ALL_STATUS = [
        this.ACCEPTED_STATUS,
        this.REJECTED_STATUS,
        this.WAITING_STATUS
    ]

    public static WAGE_TYPE_STATUS = [
        this.HOURLY_STATUS,
        this.DAILY_STATUS,
        this.MONTHLY_STATUS
    ]


    public create = async (projectApplication: ProjectApplication): Promise<any> => {
        return ProjectApplication.create(projectApplication)
    }

    public findAll = async (filter: any): Promise<any> => {
        return await ProjectApplication.findAll(filter)
    }

    public update = async (obj: any, filter: any): Promise<any> => {
        return await ProjectApplication.update(obj, filter)
    }

    public findById = async (filter: any): Promise<any> => {
        return await ProjectApplication.findOne(filter)
    }

    public pagination = (page: number, payload: any = {}, limit: number = 10): Promise<any> => {
        const offset: number = (page - 1) * limit;
        let options: any = {
            offset: offset,
            limit: limit,
            distinct: true,
            order: [[CONSTANT.DEFAULT_ORDER.FIELD, CONSTANT.DEFAULT_ORDER.TYPE]],
        }
        if (!isEmpty(payload)) {
            options = { ...options, ...payload }
        }

        return ProjectApplication.findAndCountAll(options)
    }

    public destroy = async (filter: any): Promise<any> => {
        return await ProjectApplication.destroy(filter)
    }
}
