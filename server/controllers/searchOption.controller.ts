import { Request, Response } from 'express'
import httpStatus from 'http-status';
import { SearchOptionService, SearchOptionFieldService, SearchOptionLocationService } from '../services'

export default class SearchOptionController {

    public searchOptionService = new SearchOptionService()
    public searchOptionFieldService = new SearchOptionFieldService()
    public searchOptionLocationService = new SearchOptionLocationService()


    public createSearchOption = async (req: Request, res: Response): Promise<void> => {
        const searchOption = req.body
        const searchOptionData = {
            search_type: searchOption.searchType,
            desired_profession: searchOption.profession.toString(),
            desired_date: searchOption.desiredDate,
            desired_time: searchOption.desiredTime,
            desired_project_type: searchOption.desiredProjectType,
            insurance_status: searchOption.insuranceStatus,
            desired_work_type: searchOption.desiredWorkType,
            member_id: 1
            //  member_id: searchOption.memberId
        };
        this.searchOptionService.getSearchOptionByMemberIdAndType(searchOptionData.member_id, searchOptionData.search_type)
            .then((isSearchExist) => {
                if (isSearchExist) {
                    // const filter = { where: { id: isSearchExist[0].id } }
                    // const searchOptionFilter = { where: { search_option_id: isSearchExist[0].id } }
                    // this.searchOptionService
                    //     .updateSearchOption(searchOptionData, filter)
                    // // update SearchOption field
                    // if (searchOption.fieldName && searchOption.fieldName.length > 0) {
                    //     searchOption.fieldName.map((field: string) => {
                    //         const searchOptionFieldData: any = [];
                    //         searchOptionFieldData.push({
                    //             search_option_id: isSearchExist[0].id,
                    //             name: field
                    //         })
                    //         if (searchOptionFieldData.length > 0) {
                    //             this.searchOptionFieldService.deleteSearchOptionField(searchOptionFilter).then(() => {
                    //                 this.searchOptionFieldService.createSearchOptionField(searchOptionFieldData);
                    //             })

                    //         }
                    //     })
                    // }
                    // // update SearchOption location
                    // if (searchOption.location && searchOption.location.length > 0) {
                    //     searchOption.location.map((locations: any) => {
                    //         console.log("locationssss", locations)
                    //         const searchOptionLocationData: any = [];
                    //         searchOptionLocationData.push({
                    //             search_option_id: isSearchExist[0].id,
                    //             city: locations.city,
                    //             district: locations.district,
                    //             country: locations.country
                    //         })
                    //         if (searchOptionLocationData.length > 0) {
                    //             this.searchOptionLocationService.deleteSearchOptionLocation(searchOptionFilter).then(() => {
                    //                 this.searchOptionLocationService.createSearchOptionLocation(searchOptionLocationData);
                    //             })
                    //         }
                    //     })
                    // }
                    // res.status(httpStatus.OK).send({
                    //     "status": "success",
                    //     "data": 'Search options updated successfully'
                    // });

                } else {
                    // this.searchOptionService
                    //     .createSearchOption(searchOptionData)
                    //     .then((data) => {
                    //         /*
                    //         create searchOption field
                    //         */
                    //         if (searchOption.fieldName && searchOption.fieldName.length > 0) {

                    //             const searchOptionFieldData: any = [];
                    //             for (let i = 0; i < searchOption.fieldName.length; i++) {
                    //                 searchOptionFieldData.push({
                    //                     search_option_id: data.id,
                    //                     name: searchOption.fieldName[i]
                    //                 })
                    //             }
                    //             if (searchOptionFieldData.length > 0) {
                    //                 this.searchOptionFieldService.createSearchOptionField(searchOptionFieldData);
                    //             }
                    //         }
                    //         /*
                    //         create searchOption location
                    //        */
                    //         if (searchOption.location && searchOption.location != '') {
                    //             const searchOptionLocationData: any = [];
                    //             if (searchOption.location.length > 0) {
                    //                 for (let i = 0; i < searchOption.location.length; i++) {
                    //                     searchOptionLocationData.push({
                    //                         search_option_id: data.id,
                    //                         city: searchOption.location[i].city,
                    //                         district: searchOption.location[i].district,
                    //                         country: 'test'
                    //                     })
                    //                 }
                    //                 this.searchOptionLocationService.createSearchOptionLocation(searchOptionLocationData);
                    //             }
                    //         }

                    //         res.status(httpStatus.OK).send({
                    //             "status": "success",
                    //             "data": "Search options Created successfully"
                    //         });
                    //     }).catch((err) => {
                    //         res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    //             "error": {
                    //                 "status": "failure",
                    //                 "message": err.message
                    //             }
                    //         });
                    //     });
                }
            })
    }


    /**
     * @input : Form( Object ) : SearchOptionData
     * @return Success : { result: [1] }
     * @return Error : {"error": { "code": HTTP_CODE, "message": ERROR_MESSAGE} }
     */

    public updateSearchOption = async (req: Request, res: Response): Promise<void> => {
        const Id: number = parseInt(req.params.Id);
        const filter: any = { where: { id: Id } }
        const searchOption = req.body
        const searchOptionFilter = { where: { search_option_id: Id } }
        const searchOptionData = {
            search_type: searchOption.searchType,
            desired_profession: searchOption.profession,
            desired_date: searchOption.desiredDate,
            desired_time: searchOption.desiredTime,
            desired_project_type: searchOption.desiredProjectType,
            insurance_status: searchOption.insuranceStatus,
            desired_work_type: searchOption.desiredWorkType,
            member_id: searchOption.memberId
        };

        this.searchOptionService.getSearchOption(Id)
            .then((searchData) => {
                // if (searchData.length > 0) {
                //     this.searchOptionService
                //         .updateSearchOption(searchOptionData, filter)

                //     // update SearchOption field

                //     if (searchOption.fieldName && searchOption.fieldName.length > 0) {
                //         searchOption.fieldName.map((field: string) => {
                //             const searchOptionFieldData: any = [];
                //             searchOptionFieldData.push({
                //                 search_option_id: Id,
                //                 name: field
                //             })
                //             if (searchOptionFieldData.length > 0) {
                //                 this.searchOptionFieldService.deleteSearchOptionField(searchOptionFilter).then(() => {
                //                     this.searchOptionFieldService.createSearchOptionField(searchOptionFieldData);
                //                 })

                //             }
                //         })
                //     }

                //     // update SearchOption location

                //     if (searchOption.location && searchOption.location.length > 0) {
                //         searchOption.location.map((locations: any) => {
                //             const searchOptionLocationData: any = [];
                //             searchOptionLocationData.push({
                //                 search_option_id: Id,
                //                 city: locations.city,
                //                 district: locations.district,
                //                 country: locations.country
                //             })
                //             if (searchOptionLocationData.length > 0) {
                //                 this.searchOptionLocationService.deleteSearchOptionLocation(searchOptionFilter).then(() => {
                //                     this.searchOptionLocationService.createSearchOptionLocation(searchOptionLocationData);
                //                 })
                //             }
                //         })
                //     }

                //     res.status(httpStatus.OK).send({
                //         "status": "success",
                //         "data": 'Search options updated successfully'
                //     });
                // } else {
                //     res.send({
                //         "error": {
                //             "status": "failure",
                //             "message": "No user found"
                //         }
                //     })
                // }
            })
            .catch((err) => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    "error": {
                        "status": "failure",
                        "message": err.message
                    }
                });
            });
    };
}