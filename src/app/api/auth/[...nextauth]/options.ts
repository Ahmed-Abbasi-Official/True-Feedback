import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";

export const authOptions:NextAuthOptions ={
    providers:[
        CredentialsProvider(
            {
                id:"credentials",
                name:"Credentials",
                credentials: {
                    email: { label: "Email", type: "text" },
                    password: { label: "Password", type: "password" }
                  },
                  async authorize(credentials:any, req):Promise<any>{
                    await dbConnect();
                    try {
                        const user = await UserModel.findOne({
                            $or:[
                                {email:credentials.identifier},
                                {username:credentials.identifier}
                            ]
                        })
                        if(!user){
                            throw new Error("No User Found!")
                        }
                        if(!user.isVerified){
                            throw new Error("Please verified your account first");
                        }
                        const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password);
                        if(isPasswordCorrect){
                            return user;
                        }else{
                            throw new Error("Incorrect Password");
                        }
                    } catch (error:any) {
                        throw new Error(error);
                    }
                  }

            }
        )
    ],
    callbacks: {
       
        async jwt({ token, user}) {
          return token
        },
        async session({ session, token}) {
          return session
        },
    },
    pages:{
        signIn:'/sign-in'
    },
    session:{
        strategy:'jwt'
    },
    secret:process.env.NEXT_AUTH_SECRET
}