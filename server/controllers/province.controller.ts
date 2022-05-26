import { ProvinceOutput } from './../models/province';
import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status';
import { ProvinceService } from '../services'

export default class ProvinceController {

    public provinceService = new ProvinceService()

    public getAllProvince = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.provinceService.getAllProvince()
            .then((data: ProvinceOutput[]) => res.api.create(data))
            .catch((err) => next(err));
    }

    /**
     * @param {Id} req.params.Id
     * @return Success : data
     * @return Error : error
     */
    public getProvinceById = async (req: Request, res: Response): Promise<void> => {
        const Id: number = parseInt(req.params.Id);
        this.provinceService
            .getProvinceById(Id)
            .then((data) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "data": data.length > 0 ? data[0] : []
                });
            }).catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    "error": {
                        "status": "failure",
                        "message": err.message
                    }
                });
            });
    };

    /**
     * @input : Form( Object ) : req.body
     * @return Success : {departmentName: x,hodId:x,createdAt: x,createdBy: x,updatedAt:x,updatedBy:x}
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */
    public createProvince = async (req: Request, res: Response): Promise<void> => {
        const { provinceName }: { provinceName: string } = req.body
        const createProvinceData = {
            name: provinceName
        };
        this.provinceService
            .createProvince(createProvinceData)
            .then((provinceData) => {
                res.status(httpStatus.CREATED).send({
                    "status": "success",
                    "message": "Province created successfully!!",
                });
            }).catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    "error": {
                        "status": "failure",
                        "message": err.message
                    }
                });
            });
    }

    /**
     * @input : Form( Object ) : 
     * @return Success : { result: [1] }
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */
    public updateProvince = async (req: Request, res: Response): Promise<void> => {
        const { provinceName }: { provinceName: string } = req.body
        const filter = { where: { id: parseInt(req.params.Id) } }
        const updateProvinceData = {
            name: provinceName,
        }
        this.provinceService
            .updateProvince(updateProvinceData, filter)
            .then((provinceData) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "message": 'Province updated successfully!!'
                });
            }).catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    "error": {
                        "status": "failure",
                        "message": err.message
                    }
                });
            });
    }
}