import { MemberOutput } from './../models/member';
import bcrypt from 'bcryptjs'
import { Member, SideCharacterProfile } from '../models';
import { MemberService, SideCharacterProfileService } from "../services";

const memberService = new MemberService();
const sideCharacterProfileService = new SideCharacterProfileService();

export default class MemberSeeder {
    static async up() {
        const hashedPassword: any = await bcrypt.hash('12345678', 8);
        const memberData: any = {
            name: 'user',
            email: 'user@gmail.com',
            password: hashedPassword
        }
        memberService.createMember(memberData).then(async (member: MemberOutput) => {
            await sideCharacterProfileService.createSideCharacterProfile({ member_id: member.id })
        }).catch((err) => {
            console.log(err);
        });
    }

    static async down() {
        await SideCharacterProfile.destroy({ truncate: true, cascade: true });
        await Member.destroy({ truncate: true, cascade: true });
    }
}