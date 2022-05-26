import { MemberOutput } from './../models/member';
import { Request } from 'express';
import { UserOutput } from "../models/user";

export interface NewAccessToken {
    token: any;
    expires: Date
}

export interface JoiError {
    message: string;
    path: string[],
    type: string;
    context: {
        label: string;
        key: string;
    }
}

export interface UserTokenPayload {
    user: UserOutput;
    expires: number
}
export interface MemberTokenPayload {
    member: MemberOutput;
    expires: number
}


export interface AdminAuthRequest extends Request {
    authUser: UserOutput;
}
export interface UserPagination {
    count: number;
    rows: UserOutput[]
}
export interface MemberPagination {
    count: number;
    rows: MemberOutput[]
}

// for excel
export interface ExcelMemberItem { id: number; name: string; email: string; coin_balance: number; }