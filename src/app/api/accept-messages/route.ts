import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import {User} from 'next-auth'

export async function POST(request:Request)
{

    await dbConnect();

    try {
        const session  = await getServerSession(authOptions);
        const user:User = session?.user;
    } catch (error) {
        
    }
    
}