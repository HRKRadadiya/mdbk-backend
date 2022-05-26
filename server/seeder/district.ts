import { District } from "../models";

export default class DistrictSeeder {
    static async up() {
        return await District.bulkCreate([
            {
                id: 1,
                province_id: 1,
                name: '종로구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 2,
                province_id: 1,
                name: '중구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 3,
                province_id: 1,
                name: '용산구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 4,
                province_id: 1,
                name: '성동구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 5,
                province_id: 1,
                name: '광진구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 6,
                province_id: 1,
                name: '동대문구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 7,
                province_id: 1,
                name: '중랑구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 8,
                province_id: 1,
                name: '성북구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 9,
                province_id: 1,
                name: '강북구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 10,
                province_id: 1,
                name: '도봉구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 11,
                province_id: 1,
                name: '노원구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 12,
                province_id: 1,
                name: '은평구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 13,
                province_id: 1,
                name: '서대문구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 14,
                province_id: 1,
                name: '마포구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 15,
                province_id: 1,
                name: '양천구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 16,
                province_id: 1,
                name: '강서구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 17,
                province_id: 1,
                name: '구로구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 18,
                province_id: 1,
                name: '금천구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 19,
                province_id: 1,
                name: '영등포구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 20,
                province_id: 1,
                name: '동작구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 21,
                province_id: 1,
                name: '관악구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 22,
                province_id: 1,
                name: '서초구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 23,
                province_id: 1,
                name: '강남구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 24,
                province_id: 1,
                name: '송파구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 25,
                province_id: 1,
                name: '강동구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 26,
                province_id: 2,
                name: '중구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 27,
                province_id: 2,
                name: '서구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 28,
                province_id: 2,
                name: '동구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 29,
                province_id: 2,
                name: '영도구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 30,
                province_id: 2,
                name: '부산진구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 31,
                province_id: 2,
                name: '동래구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 32,
                province_id: 2,
                name: '남구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 33,
                province_id: 2,
                name: '북구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 34,
                province_id: 2,
                name: '해운대구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 35,
                province_id: 2,
                name: '사하구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 36,
                province_id: 2,
                name: '금정구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 37,
                province_id: 2,
                name: '강서구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 38,
                province_id: 2,
                name: '연제구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 39,
                province_id: 2,
                name: '수영구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 40,
                province_id: 2,
                name: '사상구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 41,
                province_id: 2,
                name: '기장군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 42,
                province_id: 3,
                name: '중구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 43,
                province_id: 3,
                name: '동구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 44,
                province_id: 3,
                name: '서구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 45,
                province_id: 3,
                name: '남구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 46,
                province_id: 3,
                name: '북구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 47,
                province_id: 3,
                name: '수성구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 48,
                province_id: 3,
                name: '달서구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 49,
                province_id: 3,
                name: '달성군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 50,
                province_id: 4,
                name: '중구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 51,
                province_id: 4,
                name: '동구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 52,
                province_id: 4,
                name: '미추홀구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 53,
                province_id: 4,
                name: '연수구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 54,
                province_id: 4,
                name: '남동구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 55,
                province_id: 4,
                name: '부평구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 56,
                province_id: 4,
                name: '계양구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 57,
                province_id: 4,
                name: '서구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 58,
                province_id: 4,
                name: '강화군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 59,
                province_id: 4,
                name: '옹진군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 60,
                province_id: 5,
                name: '동구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 61,
                province_id: 5,
                name: '서구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 62,
                province_id: 5,
                name: '남구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 63,
                province_id: 5,
                name: '북구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 64,
                province_id: 5,
                name: '광산구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 65,
                province_id: 6,
                name: '동구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 66,
                province_id: 6,
                name: '중구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 67,
                province_id: 6,
                name: '서구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 68,
                province_id: 6,
                name: '유성구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 69,
                province_id: 6,
                name: '대덕구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 70,
                province_id: 7,
                name: '중구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 71,
                province_id: 7,
                name: '남구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 72,
                province_id: 7,
                name: '동구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 73,
                province_id: 7,
                name: '북구',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 74,
                province_id: 7,
                name: '울주군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 75,
                province_id: 8,
                name: '세종',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 76,
                province_id: 9,
                name: '수원시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 77,
                province_id: 9,
                name: '성남시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 78,
                province_id: 9,
                name: '고양시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 79,
                province_id: 9,
                name: '용인시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 80,
                province_id: 9,
                name: '부천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 81,
                province_id: 9,
                name: '안산시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 82,
                province_id: 9,
                name: '안양시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 83,
                province_id: 9,
                name: '남양주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 84,
                province_id: 9,
                name: '화성시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 85,
                province_id: 9,
                name: '평택시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 86,
                province_id: 9,
                name: '의정부시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 87,
                province_id: 9,
                name: '시흥시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 88,
                province_id: 9,
                name: '파주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 89,
                province_id: 9,
                name: '광명시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 90,
                province_id: 9,
                name: '김포시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 91,
                province_id: 9,
                name: '군포시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 92,
                province_id: 9,
                name: '광주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 93,
                province_id: 9,
                name: '이천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 94,
                province_id: 9,
                name: '양주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 95,
                province_id: 9,
                name: '오산시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 96,
                province_id: 9,
                name: '구리시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 97,
                province_id: 9,
                name: '안성시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 98,
                province_id: 9,
                name: '포천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 99,
                province_id: 9,
                name: '의왕시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 100,
                province_id: 9,
                name: '하남시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 101,
                province_id: 9,
                name: '여주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 102,
                province_id: 9,
                name: '양평군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 103,
                province_id: 9,
                name: '동두천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 104,
                province_id: 9,
                name: '과천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 105,
                province_id: 9,
                name: '가평군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 106,
                province_id: 9,
                name: '연천군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 107,
                province_id: 10,
                name: '춘천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 108,
                province_id: 10,
                name: '원주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 109,
                province_id: 10,
                name: '강릉시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 110,
                province_id: 10,
                name: '동해시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 111,
                province_id: 10,
                name: '태백시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 112,
                province_id: 10,
                name: '속초시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 113,
                province_id: 10,
                name: '삼척시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 114,
                province_id: 10,
                name: '홍천군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 115,
                province_id: 10,
                name: '횡성군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 116,
                province_id: 10,
                name: '영월군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 117,
                province_id: 10,
                name: '평창군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 118,
                province_id: 10,
                name: '정선군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 119,
                province_id: 10,
                name: '철원군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 120,
                province_id: 10,
                name: '화천군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 121,
                province_id: 10,
                name: '양구군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 122,
                province_id: 10,
                name: '인제군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 123,
                province_id: 10,
                name: '고성군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 124,
                province_id: 10,
                name: '양양군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 125,
                province_id: 11,
                name: '청주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 126,
                province_id: 11,
                name: '충주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 127,
                province_id: 11,
                name: '제천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 128,
                province_id: 11,
                name: '보은군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 129,
                province_id: 11,
                name: '옥천군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 130,
                province_id: 11,
                name: '영동군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 131,
                province_id: 11,
                name: '진천군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 132,
                province_id: 11,
                name: '괴산군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 133,
                province_id: 11,
                name: '음성군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 134,
                province_id: 11,
                name: '단양군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 135,
                province_id: 11,
                name: '증평군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 136,
                province_id: 12,
                name: '천안시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 137,
                province_id: 12,
                name: '공주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 138,
                province_id: 12,
                name: '보령시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 139,
                province_id: 12,
                name: '아산시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 140,
                province_id: 12,
                name: '서산시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 141,
                province_id: 12,
                name: '논산시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 142,
                province_id: 12,
                name: '계룡시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 143,
                province_id: 12,
                name: '당진시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 144,
                province_id: 12,
                name: '금산군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 145,
                province_id: 12,
                name: '부여군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 146,
                province_id: 12,
                name: '서천군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 147,
                province_id: 12,
                name: '청양군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 148,
                province_id: 12,
                name: '홍성군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 149,
                province_id: 12,
                name: '예산군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 150,
                province_id: 12,
                name: '태안군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 151,
                province_id: 13,
                name: '전주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 152,
                province_id: 13,
                name: '군산시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 153,
                province_id: 13,
                name: '익산시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 154,
                province_id: 13,
                name: '정읍시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 155,
                province_id: 13,
                name: '남원시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 156,
                province_id: 13,
                name: '김제시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 157,
                province_id: 13,
                name: '완주군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 158,
                province_id: 13,
                name: '진안군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 159,
                province_id: 13,
                name: '무주군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 160,
                province_id: 13,
                name: '장수군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 161,
                province_id: 13,
                name: '임실군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 162,
                province_id: 13,
                name: '순창군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 163,
                province_id: 13,
                name: '고창군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 164,
                province_id: 13,
                name: '부안군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 165,
                province_id: 14,
                name: '목포시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 166,
                province_id: 14,
                name: '여수시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 167,
                province_id: 14,
                name: '순천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 168,
                province_id: 14,
                name: '나주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 169,
                province_id: 14,
                name: '광양시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 170,
                province_id: 14,
                name: '담양군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 171,
                province_id: 14,
                name: '곡성군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 172,
                province_id: 14,
                name: '구례군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 173,
                province_id: 14,
                name: '고흥군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 174,
                province_id: 14,
                name: '보성군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 175,
                province_id: 14,
                name: '화순군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 176,
                province_id: 14,
                name: '장흥군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 177,
                province_id: 14,
                name: '강진군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 178,
                province_id: 14,
                name: '해남군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 179,
                province_id: 14,
                name: '영암군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 180,
                province_id: 14,
                name: '무안군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 181,
                province_id: 14,
                name: '함평군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 182,
                province_id: 14,
                name: '영광군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 183,
                province_id: 14,
                name: '장성군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 184,
                province_id: 14,
                name: '완도군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 185,
                province_id: 14,
                name: '진도군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 186,
                province_id: 14,
                name: '신안군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 187,
                province_id: 15,
                name: '포항시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 188,
                province_id: 15,
                name: '경주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 189,
                province_id: 15,
                name: '김천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 190,
                province_id: 15,
                name: '안동시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 191,
                province_id: 15,
                name: '구미시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 192,
                province_id: 15,
                name: '영주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 193,
                province_id: 15,
                name: '영천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 194,
                province_id: 15,
                name: '상주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 195,
                province_id: 15,
                name: '문경시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 196,
                province_id: 15,
                name: '경산시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 197,
                province_id: 15,
                name: '군위군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 198,
                province_id: 15,
                name: '의성군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 199,
                province_id: 15,
                name: '청송군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 200,
                province_id: 15,
                name: '영양군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 201,
                province_id: 15,
                name: '영덕군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 202,
                province_id: 15,
                name: '청도군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 203,
                province_id: 15,
                name: '고령군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 204,
                province_id: 15,
                name: '성주군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 205,
                province_id: 15,
                name: '칠곡군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 206,
                province_id: 15,
                name: '예천군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 207,
                province_id: 15,
                name: '봉화군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 208,
                province_id: 15,
                name: '울진군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 209,
                province_id: 15,
                name: '울릉군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 210,
                province_id: 16,
                name: '창원시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 211,
                province_id: 16,
                name: '진주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 212,
                province_id: 16,
                name: '통영시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 213,
                province_id: 16,
                name: '사천시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 214,
                province_id: 16,
                name: '김해시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 215,
                province_id: 16,
                name: '밀양시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 216,
                province_id: 16,
                name: '거제시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 217,
                province_id: 16,
                name: '양산시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 218,
                province_id: 16,
                name: '의령군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 219,
                province_id: 16,
                name: '함안군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 220,
                province_id: 16,
                name: '창녕군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 221,
                province_id: 16,
                name: '고성군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 222,
                province_id: 16,
                name: '남해군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 223,
                province_id: 16,
                name: '하동군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 224,
                province_id: 16,
                name: '산청군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 225,
                province_id: 16,
                name: '함양군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 226,
                province_id: 16,
                name: '거창군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 227,
                province_id: 16,
                name: '합천군',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 228,
                province_id: 17,
                name: '제주시',
                created_at: new Date(),
                updated_at: new Date()
            }, {
                id: 229,
                province_id: 17,
                name: '서귀포시',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    }

    static async down() {
        await District.destroy({ truncate: true, cascade: true });
    }
}