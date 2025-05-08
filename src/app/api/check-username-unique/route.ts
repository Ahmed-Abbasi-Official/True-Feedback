import dbConnect from "@/lib/dbConnect";
import {z} from 'zod'
import UserModel from "@/model/User.model";

import {usernameValidation} from '@/schemas/signUpSchema'

const usernameQuerySchema = z.object({
    username:usernameValidation
});


export async function GET(request:Request) {
    await dbConnect();
}