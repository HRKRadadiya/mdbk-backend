import { SearchOptionProfession } from '../models'
import { SearchOptionLocationInput } from '../models/searchOptionLocation'
import _ from 'lodash';
import { SearchOptionProfessionInput } from '../models/searchOptionProfession';


export default class SearchOptionProfessionService {
    public create = async (searchOptionData: SearchOptionProfessionInput[]): Promise<any> => {
        await this.destroy({
            where: {
                search_option_id: _.map(searchOptionData, 'search_option_id')
            }
        });
        return await SearchOptionProfession.bulkCreate(searchOptionData)
    }

    public destroy = async (filter: any): Promise<any> => {
        return await SearchOptionProfession.destroy(filter);
    }
}