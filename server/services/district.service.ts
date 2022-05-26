import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { District } from '../models'
import { DistrictInput } from '../models/district'

export default class DistrictService {
    /**
     * Query for All Records
     * @returns {Promise<QueryResult>}
     */
    public getAllDistrict = async (): Promise<any> => {
        return District.findAll();
    }

    /**
     * Query for Get Record 
     * @returns {Promise<QueryResult>}
     */
    public getDistrictById = async (id: number): Promise<any> => {
        return District.findByPk(id);
    }


    /**
     * Query for Get Record 
     * @returns {Promise<QueryResult>}
     */
    public getDistrictByProvinceId = async (provinceId: number): Promise<any> => {
        return District.findAll({
            where: {
                province_id: provinceId
            }
        });
    }

    /**
     * @param {object} user
     * @return Success : user object
     * @return Error : DB error
     */
    public createDistrict = async (districtData: DistrictInput): Promise<any> => {
        return District.create(districtData)
    };

    /**
     * @param {object} clientData
     * @param {filter} filter
     * @return Success : { result: [1] }
     * @return Error : DB error
     */
    public updateDistrict = async (districtData: DistrictInput, filter: any): Promise<any> => {
        return District.update(districtData, filter);
    };
}