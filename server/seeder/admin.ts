import bcrypt from 'bcryptjs'
import faker from 'faker';
import { NODE_MODE } from '../constants';
import { User } from '../models';
import { UserInput } from '../models/user';
import { UserService } from '../services';
import config from '../config/config';

const userService = new UserService();

export default class AdminSeeder {
    static async up() {
        const hashedPassword: any = await bcrypt.hash('12345678', 8);

        const userData: any = {
            user_name: 'admin',
            name: 'admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'supar-admin',
            login_type: 'website',
            status: 'enable',
            phone: faker.phone.phoneNumber(),
            employee_type: 'full-time'
        }

        await userService.createUser(userData).then((data) => {
        }).catch((err) => {
            console.log(err);
        });

        if (config.env != NODE_MODE.PRODUCTION) {
            let subAdmins: UserInput[] = [];
            for (let i: number = 0; i <= 150; i++) {

                let phone : string =  Math.floor(Math.random()*90000) + 10000000000 +"";

                subAdmins.push({
                    user_name: faker.name.findName(),
                    name: faker.name.findName(),
                    email: faker.internet.email(),
                    password: hashedPassword,
                    role: 'admin',
                    login_type: 'website',
                    status: 'enable',
                    phone,
                    employee_type: 'full-time'
                })
            }
            await User.bulkCreate(subAdmins);
        }
    }

    static async down() {
        await User.destroy({ truncate: true, cascade: true });
    }
}