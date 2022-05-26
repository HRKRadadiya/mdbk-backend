import { NextFunction, Request, Response } from "express";
import { isCelebrateError } from "celebrate";
import { NotExistHandler, TokenExpiredUserHandler, UnauthorizedUserHandler, BadResponseHandler, FormErrorsHandler } from ".";
import { collectJoiErrors } from "../utils/helper";
import ApiResponse from "../utils/apiResponse";
import config from "../config/config";
import { NODE_MODE } from "../constants";

const RootErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let returnResponse: any = {
        message: err.message,
    }

    if (config.env == NODE_MODE.DEVELOPMENT && err.stack) {
        returnResponse = { ...returnResponse, dev_error: err.stack.split('\n')[1] }
    }
    
    if (isCelebrateError(err)) {
        return res.api.validationErrors(collectJoiErrors(err))
    } else if (err instanceof NotExistHandler) {
        return res.api[err.success ? 'create' : 'badResponse'](returnResponse);
    } else if (err instanceof UnauthorizedUserHandler || err instanceof TokenExpiredUserHandler) {
        return res.api.unauthorized(returnResponse)
    } else if (err instanceof BadResponseHandler) {
        return res.api.badResponse(returnResponse)
    } else if (err instanceof FormErrorsHandler) {
        return res.api.validationErrors(err.errors)
    }

    if (res.api instanceof ApiResponse) {
        return res.api.serverError(returnResponse)
    }
    return res.status(500).json(returnResponse);

}

export default RootErrorHandler;


