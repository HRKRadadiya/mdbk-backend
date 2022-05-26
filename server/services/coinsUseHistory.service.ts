import { CoinsUseHistory } from '../models'
import { _json } from '../utils/helper';

export default class CoinsUseHistoryService {

    public static EVENT_TYPE_EXPIRED = 'expired';
    public EVENT_TYPE_REQUEST_INTERVIEW = 'request-interview';
    public EVENT_TYPE_REQUEST_CONTACT_INFORMATION = 'request-contact-information';

    public findAll = async (filter: any) => {
        return await _json(CoinsUseHistory.findAll(filter));
    }

    public findOne = async (filter: any) => {
        return await _json(CoinsUseHistory.findOne(filter));
    }

    public create = async (payload: any) => {
        return await CoinsUseHistory.create(payload);
    }
}
