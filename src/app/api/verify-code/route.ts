import dbConnect from "@/lib/dbConnect";
import { z } from 'zod'
import UserModel from "@/model/User.model";

import { verifySchema } from "@/schemas/verifySchema";


export async function POST(request: Request) {
    await dbConnect();

    try {

        const { username, code } = await request.json();    

        const result = verifySchema.safeParse({code});


        console.log(result)

        if (!result.success) {

            const codeErrors = result.error.format().code?._errors || [] ;


            return Response.json({
                success: false,
                message: codeErrors
            },
                {
                    status: 400
                })
        }

        const user = await UserModel.findOne(
            {
                username
            }
        );

        if(!user)
        {
            return  Response.json({
                  success: false,
                  message: "User Not FOund"
              },
                  {
                      status: 400
                  })
        }

        const isCodeValid = user.verifiedCode === code;

        const notExpiryCode = new Date(user.verifyCodeExpiry) > new Date() ;

        if(isCodeValid && notExpiryCode)
        {
            user.isVerified = true;
            await user.save();
            return  Response.json({
                success: true,
                message: "User Register Successfully"
            },
                {
                    status: 200
                })
        };

        if(!isCodeValid)
        {
            return  Response.json({
                success: false,
                message: "Code is Invalid"
            },
                {
                    status: 400
                })
        }

        if(!notExpiryCode)
        {
            return  Response.json({
                success: false,
                message: "Code is Expired"
            },
                {
                    status: 400
                })
        }




    } catch (error) {
        console.error("Error Checking in Code : ", error);

        return Response.json({
            success: false,
            message: "Error checking in Code"
        },
            {
                status: 500
            })


    }

}