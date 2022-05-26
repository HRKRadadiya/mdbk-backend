import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status';
import { MessageService } from '../services/';
import { ProjectService } from '../services';

export default class MessageController {

    public messageService = new MessageService()

    /**
     * @return Success : data
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */
    public getAllMessage = async (req: Request, res: Response): Promise<void> => {
        this.messageService
            .getAllMessage()
            .then((data) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "data": data
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
     * @param {Id} req.params.Id
     * @return Success : data
     * @return Error : error
     */
    public getMessageById = async (req: Request, res: Response): Promise<void> => {
        const Id: number = parseInt(req.params.Id);
        this.messageService
            .getMessageById(Id)
            .then((data) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "data": data[0]
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
        * @param {Id} memberId
        * @return Success : data
        * @return Error : error
        */
    public getMessageByMemberId = async (req: Request, res: Response): Promise<void> => {
        const memberId: number = 1;
        this.messageService
            .getMessageById(memberId)
            .then((data) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "data": data
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
    // public createMessage = async (req: Request, res: Response): Promise<void> => {
    //     const { memberId, msg }: { memberId: number, msg: string } = req.body
    //     const createMessageData = {
    //         member_id: 1,
    //         // member_id: memberId,
    //         message: msg,
    //     };
    //     this.messageService
    //         .createMessage(createMessageData)
    //         .then((messageData) => {
    //             res.status(httpStatus.CREATED).send({
    //                 "status": "success",
    //                 "message": "Message created successfully!!",
    //             });
    //         }).catch((err) => {
    //             res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    //                 "error": {
    //                     "status": "failure",
    //                     "message": err.message
    //                 }
    //             });
    //         });
    // }

    /**
     * @input : Form( Object ) : 
     * @return Success : { result: [1] }
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */
    public updateMessage = async (req: Request, res: Response): Promise<void> => {
        const { memberId, msg }: { memberId: number, msg: string } = req.body
        const filter = { where: { id: parseInt(req.params.Id) } }
        const updateMessageData = {
            member_id: memberId,
            message: msg,
        }
        this.messageService
            .updateMessage(updateMessageData, filter)
            .then((data) => {
                res.status(httpStatus.OK).send({
                    "status": "success",
                    "message": 'Message updated successfully!!'
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
     * @param  {Number} req.params.Id
     * @return Success : { result: [1] }
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */
    // public deleteMessage = async (req: Request, res: Response): Promise<void> => {
    //     const Id: number = parseInt(req.params.Id);
    //     const filter: any = { where: { id: Id } }
    //     this.messageService
    //         .deleteMessage(filter)
    //         .then((messageData) => {
    //             res.status(httpStatus.OK).send({
    //                 "status": "success",
    //                 "message": 'Message deleted successfully!!'
    //             });
    //         }).catch((err) => {
    //             res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    //                 "error": {
    //                     "status": "failure",
    //                     "message": err.message
    //                 }
    //             });
    //         });
    // };

  
    public deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id);
        let filter: any = {
            where: { id: Id }
        }
        let payload = {
            status: ProjectService.STATUS_DELETED
        }
        await this.messageService.updateMessage(payload, filter)
        res.api.create({
            'message': 'Message deleted successfully!'
        });
    }
    public getMessagesByLoginMemberId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        let payload = {
            where: { member_id: req.authMember.id,
                    status :  ProjectService.STATUS_ENABLE 
                }
        }
        let messages: any  = await this.messageService.findAll(payload)
        res.api.create(messages);
    }

    /**
     * message create  
     */
    public createMessage = async (req:Request,res:Response,next:NextFunction): Promise<void> =>{
        let message = req.body;
        const messageData: any = {
            member_id: req.authMember.id,
            message: message.message,
        }
        let messages = await this.messageService.create(messageData)
        res.api.create(messages);

    }
}