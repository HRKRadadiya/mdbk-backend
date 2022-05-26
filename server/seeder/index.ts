import { checkPath, getFileName } from '../utils/helper';
import AdminSeeder from './admin';
import BCoinPackagesSeeder from './bCoinPackages';
import CoinUseHistorySeeder from './coinUseHistory';
import DistrictSeeder from './district';
import MemberSeeder from './member';
import MemberListSeeder from './memberList';
import ProvinceSeeder from './province'
import config from '../config/config';
import { NODE_MODE } from '../constants';
import SearchSeeder from './search';
import ForumSeeder from './forum';

const args = process.argv;

class DatabaseSeed {
    static async up() {
        if (config.env == NODE_MODE.PRODUCTION) {
            await ProvinceSeeder.up()
            await DistrictSeeder.up()
            await BCoinPackagesSeeder.up();
            await AdminSeeder.up();
        } else {
            await ProvinceSeeder.up()
            await DistrictSeeder.up()
            await AdminSeeder.up();
            await BCoinPackagesSeeder.up();
            await SearchSeeder.up();
            // await ForumSeeder.up();
        }
    }

    static async down() {
        if (config.env == NODE_MODE.PRODUCTION) {
            await AdminSeeder.down();
            await BCoinPackagesSeeder.down();
            await DistrictSeeder.down()
            await ProvinceSeeder.down()
        } else {
            // await ForumSeeder.down();
            await SearchSeeder.down();
            await BCoinPackagesSeeder.down();
            await AdminSeeder.down();
            await DistrictSeeder.down()
            await ProvinceSeeder.down()
        }
    }




    static run() {
        if (checkPath(args, '--path')) {
            const fileName: String = getFileName(args);
            const seeder = require('./' + fileName).default;
            console.log("seeder", seeder);

            if (checkPath(args, '--down')) {
                seeder.down();
            } else {
                seeder.up();
            }
        } else {
            if (checkPath(args, '--down')) {
                this.down()
            } else {
                this.up()
            }
        }
    }
}


DatabaseSeed.run();