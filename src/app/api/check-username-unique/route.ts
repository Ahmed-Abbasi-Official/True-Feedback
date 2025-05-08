import dbConnect from "@/lib/dbConnect";
import { z } from 'zod'
import UserModel from "@/model/User.model";

import { usernameValidation } from '@/schemas/signUpSchema'

const usernameQuerySchema = z.object({
    username: usernameValidation
});


export async function GET(request: Request) {

    if(request.method !== "GET")
    {
        return Response.json(
            {
                success:false,
                message:"Method not allowed"
            },
            {
                status:405
            }
        )
    }

    await dbConnect();

    try {

        const {searchParams} = new URL(request.url);

        const queryParam = {
            username:searchParams.get("username")
        };

        const result = usernameQuerySchema.safeParse(queryParam);

        console.log("result : ",result)

        if(!result.success)
        {
            const usernameErrors = result.error.format().username?._errors || [] ;

            return Response.json(
                {
                    success:false,
                    message:usernameErrors,
                },
                {
                    status:400
                }
            );
        };

        const {username} = result.data;

        const existingUsername = await UserModel.findOne(
            {
                username
            }
        );

        if(existingUsername)
        {
          return  Response.json(
                {
                    success:false,
                    message:"This username is already taken"
                },
                {
                    status:400
                }
            )
        }
        console.log("result : ",result)

        return  Response.json(
            {
                success:true,
                message:"This username is unique"
            },
            {
                status:200
            }
        )



    } catch (error) {
        console.error("Error Checking in username : ", error);

        Response.json({
            success: false,
            message: "Error checking in username"
        },
            {
                status: 500
            })

    }

}