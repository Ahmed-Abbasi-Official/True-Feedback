import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { User } from 'next-auth'

export async function POST(request: Request) {

    await dbConnect();


    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
            {
                status: 401
            })
    };

    const userId = user._id;
    const { acceptMessages } = await request.json();
    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage:acceptMessages
            },
            {new:true}
        );

        if(!updatedUser)
        {
            return Response.json({
            success: false,
            message: "failed to update user status to accpet messages"
        },
            {
                status: 401
            })
        }

        return Response.json({
            success: true,
            message: "Message accept status update Succesfully!",
            updatedUser
        },
            {
                status: 200
            })

    } catch (error) {
        console.log("failed to update user status to accpet messages" , error);

        return Response.json({
            success: false,
            message: "failed to update user status to accpet messages"
        },
            {
                status: 500
            })
    }

}


export async function GET(request:Request) 
{

    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
            {
                status: 401
            })
    };

    const userId = user._id;

    try {
        
        const foundUser = await UserModel.findById(userId);
    
        if(!foundUser)
        {
           return Response.json({
                success: false,
                message: "User Not Found"
            },
                {
                    status: 400
                }) 
        };
    
        return Response.json({
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
                {
                    status: 200
                })
    } catch (error) {
        console.log("Error in getting message accepting status");

        return Response.json({
            success: false,
            message: "Error in getting message accepting status"
        },
            {
                status: 500
            })
    }


    
    
}