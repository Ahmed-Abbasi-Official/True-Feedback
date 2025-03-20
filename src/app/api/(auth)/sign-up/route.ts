import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";


import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        //  CHECK FOR ( USERNAME ) DUPLICATION

        const existingUsername = await UserModel.findOne({username})

        if(existingUsername){
            Response.json({
                success:false,
                message:"Username already exist"
            },{
                status:400
            })
            return;
        };

        const existingEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000+Math.random()*900000).toString();

        if(existingEmail){
            true // TODO: Back 
        }else{
            const hashPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
          const newUser =   new UserModel({
                 username,
                    email,
                    password:hashPassword,
                    verifiedCode:verifyCode,
                    verifyCodeExpiry:expiryDate,
                    isAcceptingMessage:true,
                    isVerified:false,
                    messages:[]
            })
            await newUser.save();
        }

       const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success:false,
                message:(emailResponse).message
            },{status:500})
        }

        return Response.json({
            success:true,
            message:"User Register Successfully please verify your email"
        },{status:201})





       
    } catch (error) {
        console.error("Error Registring User", error);
        return Response.json(
            {
                success: false,
                message: "Error in registring User!"
            },
            {
                status: 500
            }
        )
    }
}