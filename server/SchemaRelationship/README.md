const member = await Member.findOne({
            where: {
                id: Id
            },
            // include: 'side_character_profile',
            include: {
                all: true,
                nested: true
            },
            // include: [
            //     {
            //         model: SideCharacterProfile,
            //         as: 'side_character_profile',
            //         include: [
            //             {
            //                 model: SideCharacterProfileField,
            //                 as: 'fields'
            //             },
            //             {
            //                 model: SideCharacterProfileLocation,
            //                 as: 'locations'
            //             }
            //         ]
            //     }
            // ]
        });