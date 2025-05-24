import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request:Request) 
{
    
    await dbConnect();

    try {

        const {username,content} = await request.json();

        const user = await UserModel.findOne({username});

        if(!user)
        {
              return Response.json({
                success: false,
                message: "User not found"
            },
                {
                    status: 400 
                })
        };

        if(!user.isAcceptingMessage)
        {
              return Response.json({
                success: false,
                message: "User is not accepting Messages"
            },
                {
                    status: 403
                })
        };

        const newMessage = {content , createdAt:new Date()};
        user.messages.push(newMessage as Message) ;

       await user.save();

       return Response.json({
                success: true,
                message: "Message send succesfully"
            },
                {
                    status: 200
                })

    } catch (error) {
        console.log("Error in Sending Message",error);
          return Response.json({
                success: false,
                message: "Error in Sending Message  "
            },
                {
                    status: 500 
                })
    }

}