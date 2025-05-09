import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";


import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        // console.log(username)

        //  CHECK FOR ( USERNAME ) DUPLICATION

        const existingUsername = await UserModel.findOne({username})

        if(existingUsername){
            return Response.json({
                success:false,
                message:"Username already exist"
            },{
                status:400
            })
            
        };

        const existingEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000+Math.random()*900000).toString();

        if(existingEmail){
            if(existingEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"Email is already exist"
                },{status:400})
            }else{
                const hashPassword = await bcrypt.hash(password,10);
                existingEmail.username=username;
                existingEmail.password=hashPassword;
                existingEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingEmail.save();
            }
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

        console.log("Sending verification email...");
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        console.log("Email response: ", emailResponse);
        

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