import { MemberOutput } from './../../server/models/member';
import ApiResponse from '../../server/utils/apiResponse';
import { UserOutput } from './../../server/models/user';

declare global {
    namespace Express {
        interface Request {
            authUser: UserOutput;
            authMember: MemberOutput;
            profile: any;
        }
        interface Response {
            api: ApiResponse;
        }
    }
}