import { MemberOutput } from './../models/member';
import bcrypt from 'bcryptjs'
import { ClientProfileService, MemberService, SideCharacterProfileService } from "../services";
import faker from 'faker';

const memberService = new MemberService();
const sideCharacterProfileService = new SideCharacterProfileService();
const clientProfileService = new ClientProfileService();

export default class MemberListSeeder {
    static async up() {
        // create member
        const hashedPassword: any = await bcrypt.hash('12345678', 8);
        for (let i = 1; i <= 60; i++) {
            const memberData: any = {
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: hashedPassword
            }
            await memberService.createMember(memberData)
                .then(async (member: MemberOutput) => {
                    let payload = { member_id: member.id };
                    switch (true) {
                        case i < 21:
                            await clientProfileService.createClient(payload)
                            break;

                        case i < 41:
                            await sideCharacterProfileService.createSideCharacterProfile(payload)
                            break;

                        default:
                            await clientProfileService.createClient(payload)
                            await sideCharacterProfileService.createSideCharacterProfile(payload)
                            break;
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }
    }

    static async down() {

    }
}