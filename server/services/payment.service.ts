import moment from "moment";
import sequelize from "sequelize";
import { Op } from "sequelize";
import { CoinsUseHistoryService, ProfileService } from ".";
import { COINS, DEFAULT_ORDER, MEMBER, MEMBER_TYPE } from "../constants";
import { PaymentHistory } from "../models";
import { isEmpty, _json } from "../utils/helper";

export default class PaymentService {

    public EVENT_TYPE_REQUEST_INTERVIEW = 'request-interview';
    public EVENT_TYPE_REQUEST_CONTACT_INFORMATION = 'request-contact-information';

    public coinsUseHistoryService = new CoinsUseHistoryService()
    public profileService = new ProfileService();

    public purchasePackage = async (coinData: any) => {
        return await PaymentHistory.create(coinData);
    }

    public update = async (payload: any, filter: any) => {
        return await PaymentHistory.update(payload, filter);
    }

    // public find = async (coinData: any) => {
    //     return await PaymentHistory.create(coinData);
    // }

    public findAll = async (filter: any) => {
        return await PaymentHistory.findAll(filter);
    }

    public checkCoinBalance = async (memberId: any, registrationType: number, isContactInfo: boolean) => {
        let profile: any = await this.profileService.findByMemberId(memberId, registrationType)

        let totalCoins: any = await _json(this.findAll({
            where: {
                member_id: memberId,
                profile_id: profile.id,
                profile_type: (registrationType == MEMBER.SIDE_CHARACTER) ? MEMBER_TYPE.SIDE_CHARACTER : MEMBER_TYPE.CLIENT,
                coins: {
                    [Op.ne]: sequelize.col('use')
                }
            },
            order: [[DEFAULT_ORDER.FIELD, 'asc']],
        }));

        let totalCoinBalance = COINS.request_coins;

        for (const coin of totalCoins) {
            let useCoin: any = coin.use;
            if (coin.coins <= totalCoinBalance) {
                totalCoinBalance -= coin.coins
                useCoin = coin.coins;
            } else {
                useCoin = totalCoinBalance;
                totalCoinBalance = 0;
            }

            await this.update({
                use: coin.use + useCoin
            }, { where: { id: coin.id } })

            if (totalCoinBalance == 0) {
                await this.coinsUseHistoryService.create({
                    member_id: memberId,
                    coins: COINS.request_coins,
                    event_type: isContactInfo ? this.EVENT_TYPE_REQUEST_CONTACT_INFORMATION : this.EVENT_TYPE_REQUEST_INTERVIEW,
                    details: isContactInfo ? this.EVENT_TYPE_REQUEST_CONTACT_INFORMATION : this.EVENT_TYPE_REQUEST_INTERVIEW, //todo refactor
                    profile_id: profile.id,
                    profile_type: (registrationType == MEMBER.SIDE_CHARACTER) ? MEMBER_TYPE.SIDE_CHARACTER : MEMBER_TYPE.CLIENT,
                })
                break;
            }
        }
    }

    public setExpiredCoins = async (memberId: any) => {
        let totalCoins: any = await this.findAll({
            where: {
                member_id: memberId,
                coins: {
                    [Op.ne]: sequelize.col('use')
                },
                created_at: {
                    [Op.lt]: `${moment().subtract(2, "years").format("YYYY-MM-DD")} 00:00:00.000000`
                }
            }
        });

        for (const coin of totalCoins) {
            await this.update({
                use: coin.coins
            }, { where: { id: coin.id } })

            let isCoinExpire: any = await this.coinsUseHistoryService.findOne({
                where: {
                    member_id: memberId,
                    coins: coin.coins,
                    event_type: CoinsUseHistoryService.EVENT_TYPE_EXPIRED,
                }
            })

            if (isEmpty(isCoinExpire)) {
                await this.coinsUseHistoryService.create({
                    member_id: memberId,
                    coins: coin.coins,
                    event_type: CoinsUseHistoryService.EVENT_TYPE_EXPIRED,
                    details: CoinsUseHistoryService.EVENT_TYPE_EXPIRED, //todo refactor
                })
            }
        }
    }
}