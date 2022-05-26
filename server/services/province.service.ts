import sequelize from '../config/database'
import { QueryTypes } from 'sequelize';
import { Province } from '../models'
import { ProvinceInput } from '../models/province'

export default class ProvinceService {
    /**
     * Query for All Records
     * @returns {Promise<QueryResult>}
     */
    public getAllProvince = async (): Promise<any> => {
        return Province.findAll();
    }


    /**
     * Query for Get Record 
     * @returns {Promise<QueryResult>}
     */
    public getProvinceById = async (id: number): Promise<any> => {
        return Province.findByPk(id);
    }


    /**
     * @param {object} user
     * @return Success : user object
     * @return Error : DB error
     */
    public createProvince = (provinceData: ProvinceInput): Promise<any> => {
        return new Promise((resolve, reject) => {
            Province.create(provinceData)
                .then((data) => resolve(data))
                .catch((error) => reject(error))
        })
    };


    /**
     * @param {object} clientData
     * @param {filter} filter
     * @return Success : { result: [1] }
     * @return Error : DB error
     */
    public updateProvince = async (provinceData: Partial<ProvinceInput>, filter: any): Promise<any> => {
        return new Promise((resolve, reject) => {
            Province.update(provinceData, filter)
                .then((Data) => {
                    resolve(Data)
                }).catch((error) => {
                    reject(error);
                });
        });
    };
}