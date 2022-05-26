import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import { Op } from 'sequelize';
import { NotExistHandler } from '../../errorHandler';
import { UserOutput } from '../../models/user';
import { UserService } from '../../services'
import { UserPagination } from '../../types';
import { inArray, isEmpty } from '../../utils/helper';

export default class UserController {

    public userService = new UserService()

    public getAllUser = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        const filter = req.query;
        const sortDirection = !isEmpty(filter.sort_direction) ? filter.sort_direction : 'DESC';
        let where = {}

        if (filter.field && inArray(filter.field, ['all', 'name', 'email', 'user_name', 'phone']) && filter.q && filter.q.trim().length != 0) {
            if (filter.field == 'all') {
                let orWhere: any = ['name', 'email', 'user_name', 'phone'].map((field: any) => {
                    return {
                        [field]: {
                            [Op.iLike]: '%' + filter.q.trim() + '%'
                        }
                    }
                })

                where = {
                    ...where,
                    [Op.or]: orWhere
                }
            } else {
                where = {
                    ...where, [filter.field]: {
                        [Op.iLike]: '%' + filter.q.trim() + '%'
                    }
                }
            }
        }

        where = {
            ...where,
            'id': {
                [Op.ne]: 1
            }
        }

        this.userService.pagination(parseInt(filter.page), where, sortDirection)
            .then((queryResult: UserPagination) => res.api.create(queryResult))
            .catch((error: Error) => next(error))
    }

    public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id)

        this.userService.getUserById(Id)
            .then((user: UserOutput) => {
                res.api.create({
                    user: user
                })
            }).catch((error: Error) => next(error))
    }

    public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = req.body
        let isEmailExists: any = await this.userService.getUserByEmail(user.email);
        if (!isEmpty(isEmailExists)) {
            return res.api.validationErrors({
                'email': 'email already exists'
            })
        }

        const hashedPassword: any = await bcrypt.hash(user.password, 8);
        const createUserData = {
            name: user.name,
            email: user.email,
            user_name: user.user_name,
            password: hashedPassword,
            phone: user.phone,
            employee_type: user.employee_type,
            login_type: user.login_type || UserService.LOGIN_TYPE_WEBSITE,
            role: user.role ? UserService.ROLE_SUPAR_ADMIN : UserService.ROLE_ADMIN,
            status: user.status || UserService.STATUS_ENABLE,
        }

        this.userService.createUser(createUserData)
            .then((user: any) => {
                res.api.create({
                    "message": "User created successfully!!",
                    user: user,
                })
            }).catch((error: Error) => next(error))

    }

    public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const user = req.body
        const Id = parseInt(req.params.Id)
        const filter = { where: { id: Id } }

        const updateUserData = {
            name: user.name,
            email: user.email,
            user_name: user.user_name,
            phone: user.phone,
            employee_type: user.employee_type,
            role: user.role ? UserService.ROLE_SUPAR_ADMIN : UserService.ROLE_ADMIN,
        }

        this.userService.getUserById(Id).then((user: UserOutput) => {
            if (!isEmpty(user)) {
                this.userService
                    .updateUser(updateUserData, filter)
                    .then(async (result: any) => {
                        user = await this.userService.getUserById(Id);
                        res.api.create({
                            "message": 'User updated successfully!',
                            user,
                        })
                    }).catch((err: Error) => next(err))
            } else {
                next(new NotExistHandler("User not found"))
            }
        }).catch((error: Error) => next(error))
    }

    public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const Id = parseInt(req.params.Id)
        const filter = { where: { id: Id } }

        this.userService.getUserById(Id)
            .then((user: UserOutput) => {
                if (!isEmpty(user)) {
                    this.userService.deleteUser(filter)
                        .then((result: any) => res.api.__create('User deleted successfully!'))
                        .catch((err: Error) => next(err))
                } else {
                    next(new NotExistHandler("User not found"))
                }
            }).catch((error: Error) => next(error))
    }

    public deleteAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const IdArr: number[] = req.body.Id
        const filter: any = { where: { id: IdArr } }

        this.userService.deleteAllUsers(filter)
            .then((result: any) => res.api.__create('Selected users deleted successfully!'))
            .catch((err: Error) => next(err))
    }

}