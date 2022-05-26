import { BCoinPackages } from '../models';

export default class BCoinPackagesSeeder {
    static async up() {
        await BCoinPackages.bulkCreate([
            {
                name: '',
                price: 40000,
                coins: 25000
            },
            {
                name: '',
                price: 60000,
                coins: 45000
            },
            {
                name: '',
                price: 80000,
                coins: 65000
            },
        ])
    }

    static async down() {
        await BCoinPackages.destroy({ truncate: true, cascade: true });
    }
}