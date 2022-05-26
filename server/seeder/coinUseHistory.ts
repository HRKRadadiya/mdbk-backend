import { BCoinPackages, CoinsUseHistory } from '../models';

export default class CoinUseHistorySeeder {
    static async up() {
        // await CoinsUseHistory.bulkCreate([
        //     {
        //         member_id: 1,
        //         coins: 2000,
        //         event_type: '',
        //         details: 'interview request'
        //     }
        // ])
    }

    static async down() {
        await CoinsUseHistory.destroy({ truncate: true, cascade: true });
    }
}