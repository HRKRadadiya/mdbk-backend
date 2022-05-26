import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { PaymentHistoryService, BCoinService, CoinsUseHistoryService, MemberService, ProfileService } from "../services";
import { isEmpty, uuidv4, _json } from "../utils/helper";
import _ from "lodash";
import { Op } from "sequelize";
import { where } from "sequelize";
import sequelize from "sequelize";
import { Member } from "../models";
import { MEMBER, MEMBER_TYPE } from "../constants";

export default class PaymentController {
    public paymentHistoryService = new PaymentHistoryService();
    public coinsUseHistoryService = new CoinsUseHistoryService();
    public memberService = new MemberService();
    public bCoinService = new BCoinService();
    public profileService = new ProfileService();

    public purchasePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { package_id, registration_type } = req.body;

        return await this.bCoinService.findById(package_id)
            .then(async (coinPackage: any) => {
                let member: any = req.authMember;
                if (!isEmpty(coinPackage)) {
                    let profile: any = await this.profileService.findByMemberId(req.authMember.id, registration_type)
                    if (isEmpty(profile)) {
                        return res.api.validationErrors({
                            'profile': 'Profile not found'
                        })
                    }

                    let payload = {
                        member_id: req.authMember.id,
                        status: 'success',
                        transaction_id: uuidv4(),
                        amount: coinPackage.price,
                        coins: coinPackage.coins,
                        profile_id: profile.id,
                        profile_type: (registration_type == MEMBER.SIDE_CHARACTER) ? MEMBER_TYPE.SIDE_CHARACTER : MEMBER_TYPE.CLIENT
                    }
                    await this.paymentHistoryService.purchasePackage(payload)
                        .then(async (paymentData: any) => {
                            let availableBalanceColumn: any = (registration_type == MEMBER.SIDE_CHARACTER) ? 'side_character_available_coin' : 'client_available_coin'
                            let data = {
                                id: req.authMember.id,
                                coin_balance: Math.round(req.authMember.coin_balance) + Math.round(coinPackage.coins),
                                [availableBalanceColumn]: Math.round(member[availableBalanceColumn]) + Math.round(coinPackage.coins)
                            }
                            await this.memberService.updateMember(data)
                            res.api.create({
                                payment: paymentData
                            })
                        })
                } else {
                    res.api.validationErrors({
                        package_id: "Invalid Package"
                    })
                }
            })
    }

    public getCoinHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { year, month, registration_type }: any = req.query
        let filterData = [];
        if (!isEmpty(year)) {
            filterData.push(sequelize.where(sequelize.fn('date_part', 'YEAR', sequelize.col('created_at')), year));
        }

        if (!isEmpty(month)) {
            filterData.push(sequelize.where(sequelize.fn('date_part', 'MONTH', sequelize.col('created_at')), month));
        }

        let profile: any = await this.profileService.findByMemberId(req.authMember.id, registration_type)
        if (isEmpty(profile)) {
            return res.api.validationErrors({
                'profile': 'Profile not found'
            })
        }

        let filter: any = {
            where: {
                [Op.and]: [
                    ...filterData,
                    {
                        member_id: req.authMember.id,
                        profile_id: profile.id,
                        profile_type: (registration_type == MEMBER.SIDE_CHARACTER) ? MEMBER_TYPE.SIDE_CHARACTER : MEMBER_TYPE.CLIENT
                    }
                ]
            }
        }

        const [purchase, bonus]: any = await Promise.all(['purchase', 'bonus'].map(async (paymentType) => {
            let paymentFilter = { ...filter };
            paymentFilter.where = {
                ...filter.where,
                payment_type: paymentType
            }

            let data: any = await this.paymentHistoryService.findAll(paymentFilter);
            if (!isEmpty(data)) {
                data = data.map((item: any) => {
                    return {
                        id: item.id,
                        coins: item.coins,
                        details: 'B Coin Purchase',
                        is_purchase: true,
                        payment_type: item.payment_type,
                        created_at: item.created_at,
                    };
                })
            }
            return data;
        }))

        let coinsUseHistory: any = await this.coinsUseHistoryService.findAll(filter);
        if (!isEmpty(coinsUseHistory)) {
            coinsUseHistory = coinsUseHistory.map((item: any) => {
                return {
                    id: item.id,
                    coins: item.coins,
                    details: item.details,
                    is_purchase: false,
                    created_at: item.created_at,
                };
            })
        }

        let data: any = _.orderBy([...purchase, ...bonus, ...coinsUseHistory], ['created_at'], ['desc'])
        let purchase_coin = _.sumBy(purchase, 'coins');
        let bonus_coin = _.sumBy(bonus, 'coins');

        res.api.create({
            'coin_history': data,
            'purchase_coins': purchase_coin,
            'bonus_coins': bonus_coin,
            'total_coins': (registration_type == MEMBER.CLIENT) ? Number(req.authMember.client_available_coin) : Number(req.authMember.side_character_available_coin)
        })
    }
}