import { NextFunction, Request, Response } from "express";
import BCoinService from "../services/bCoin.service";

export default class BCoinController {

    public bCoinService = new BCoinService();

    public getBcoinPackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.bCoinService.getAllPackages()
            .then((data) => res.api.create(data))
            .catch((err) => next(err));
    }
}