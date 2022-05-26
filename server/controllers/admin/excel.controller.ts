import { NextFunction, Request, Response } from 'express'
import excel from 'exceljs';
import { MemberOutput } from '../../models/member';
import { MemberService } from '../../services'
import { ExcelMemberItem } from '../../types';
import { isEmpty } from '../../utils/helper';
import moment from 'moment';

export default class ExcelController {

    public memberService = new MemberService()

    public downloadAllMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let members: any[] = [];
        let header: any = [
            { header: "Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 30 },
            { header: "Date of Registration	", key: "created_at", width: 15 },
            { header: "Side Character Profile Completion Rate", key: "side_character_profile_progress", width: 15 },
            { header: "Client Profile Completion Rate", key: "client_profile_progress", width: 15 },
        ];

        await this.memberService.getAllUser().then((membersResult: MemberOutput[]) => {
            if (!isEmpty(membersResult)) {
                membersResult.forEach((member) => {
                    members.push({
                        name: member.name,
                        email: member.email,
                        created_at: moment(member.created_at).format('YYYY.MM.DD'),
                        side_character_profile_progress: member.side_character_profile_progress,
                        client_profile_progress: member.client_profile_progress,
                    });
                });
            }
        }).catch((error: Error) => next(error))

        res.api.create({
            header: header,
            body: members
        })
    }
}