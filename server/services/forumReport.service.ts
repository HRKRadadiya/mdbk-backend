import { ADMIN_DEFAULT_ORDER, DEFAULT_ORDER } from "../constants";
import ForumReport from "../models/forumReport";
import ForumLink, { ForumLinkInput } from "../models/forum_link";
import { isEmpty, _json } from "../utils/helper";
import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import _ from "lodash";

export default class ForumReportService {
    public static REPORT_TYPE_QUESTION = 'question';
    public static REPORT_TYPE_RESPONSE = 'response';
    public static REPORT_TYPE_COMMENT = 'comment';

    public static PROFILE_TYPE_SIDE_CHARACTER = 'side-character';
    public static PROFILE_TYPE_CLIENT = 'client';

    public paginate = async (page: number, filter: any = '', sortDirection = 'DESC', limit: number = 10): Promise<any> => {
        const offset: number = (page - 1) * limit;
        let options: any = {
            offset: offset,
            limit: limit,
            field: 'created_at',
        }

        let list: any = {
            rows: [],
            count: 0
        }

        list.rows = await _json(sequelize.query(
            `SELECT source_id, report_type, count(member_id) as total, max(created_at) as report_date  FROM forum_report ${filter} GROUP BY(source_id, report_type) order by report_date ${sortDirection}  LIMIT :limit OFFSET :offset`,
            {
                replacements: options,
                type: QueryTypes.SELECT
            }
        ));

        let totalReport: any = await sequelize.query(
            `select count(*)
            from (SELECT source_id, report_type, count(member_id) as total FROM forum_report ${filter}  GROUP BY (source_id, report_type) ) as t`,
            {
                type: QueryTypes.SELECT
            }
        );
        list.count = parseInt(totalReport[0].count)
        return list
    }

    public destroy = async (filter: any): Promise<any> => {
        return await ForumReport.destroy(filter);
    }

    public update = async (payload: any, filter: any): Promise<any> => {
        return await ForumReport.update(payload, filter);
    }

    public findAll = async (filter: any): Promise<any> => {
        return await ForumReport.findAll(filter);
    }

    public findOne = async (filter: any): Promise<any> => {
        return await ForumReport.findOne(filter);
    }

    public findCount = async (filter: any): Promise<any> => {
        return await ForumReport.count(filter);
    }

    public myReportCount = async (source_id: number, report_type: string): Promise<any> => {
        return await this.findCount({
            where: {
                source_id,
                report_type
            }
        });
    }

    public reportFlag = async (filter: any): Promise<any> => {
        const report: any = await ForumReport.findOne(filter);
        return !isEmpty(report);
    }

    public create = async (payload: any): Promise<any> => {
        const isReport: any = await ForumReport.findOne({
            where: payload
        })

        if (isReport) {
            await ForumReport.destroy({
                where: payload
            })
            return false;
        } else {
            await ForumReport.create(payload)
            return true;
        }
    }
}
