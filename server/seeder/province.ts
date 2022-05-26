import { Province } from "../models";

export default class ProvinceSeeder {
    static async up() {
        return await Province.bulkCreate([{
            id: 1,
            name: '서울',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 2,
            name: '부산',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 3,
            name: '대구',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 4,
            name: '인천',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 5,
            name: '광주',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 6,
            name: '대전',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 7,
            name: '울산',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 8,
            name: '세종',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 9,
            name: '경기도',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 10,
            name: '강원도',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 11,
            name: '충청북도',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 12,
            name: '충청남도',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 13,
            name: '전라북도',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 14,
            name: '전라남도',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 15,
            name: '경상북도',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 16,
            name: '경상남도',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            id: 17,
            name: '제주도',
            created_at: new Date(),
            updated_at: new Date()
        }]);
    }

    static async down() {
        await Province.destroy({ truncate: true, cascade: true });
    }
}