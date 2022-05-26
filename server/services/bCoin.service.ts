import { isObject } from "lodash";
import BCoinPackages from "../models/bCoinPackages"

export default class BCoinService {

    public getAllPackages = () => {
        return BCoinPackages.findAll();
    }

    public findById = async (filter: any) => {
        if (isObject(filter)) {
            return await BCoinPackages.findAll();
        } else {
            return await BCoinPackages.findByPk(filter);
        }
    }
}