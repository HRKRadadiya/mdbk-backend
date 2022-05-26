import Report from '../models/report';
import { isEmpty } from '../utils/helper'
import * as CONSTANTS from '../constants'
import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';

export default class ReportService {

    public static LIKE_TYPE_SIDE_CHARACTER = 'side-character';
    public static LIKE_TYPE_CLIENT = 'client';
    public static LIKE_TYPE_REQUEST_INTERVIEW = 'request-interview';
    public static LIKE_TYPE_REQUEST_CONTACT_INFORMATION = 'request-contact-information';

    public likeUnlike = async (payload: any): Promise<any> => {
        const isLike: any = await Report.findOne({
            where: payload
        })
        if (isLike) {
            await Report.destroy({
                where: payload
            })
            return false;
        } else {
            await Report.create(payload)
            return true;
        }
    }

    public reportFlag = async (source_id: number, report_type: string, member_id: number): Promise<any> => {
        const report: any = await Report.findOne({
            where: {
                source_id,
                report_type,
                member_id
            }
        });
        return !isEmpty(report);
    }

    public myReportCount = async (source_id: number, report_type: string): Promise<any> => {
        console.log(report_type);

        return await Report.count({
            where: {
                source_id,
                report_type
            }
        });
    }

    public paginate = async (page: number, filter: any = '', limit: number = 10): Promise<any> => {
        const offset: number = (page - 1) * limit;
        let options: any = {
            offset: offset,
            limit: limit
        }

        let list: any = {
            rows: [],
            count: 0
        }

        list.rows = await sequelize.query(
            `select source_id, report_type,total, 
                (select created_at from report where report.source_id=t.source_id and report.report_type=t.report_type order by id desc limit 1) 
                as report_date
                from(SELECT source_id, report_type, count(member_id) as total FROM report ${filter} GROUP BY(source_id, report_type)  LIMIT :limit OFFSET :offset) as t`,
            {
                replacements: options,
                type: QueryTypes.SELECT
            }
        );

        let totalReport: any = await sequelize.query(
            `select count(*)
            from (SELECT source_id, report_type, count(member_id) as total FROM report ${filter}  GROUP BY (source_id, report_type) ) as t`,
            {
                type: QueryTypes.SELECT
            }
        );
        list.count = totalReport[0].count
        return list
    }

    public destroy = async (filter: any): Promise<any> => {
        return await Report.destroy(filter);
    }
}