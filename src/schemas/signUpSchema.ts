import {z} from 'zod'

// * USERNAME VALIDATION BY ZOD

export const usernameValidation = z
.string()
.min(2,"Username must be atleast 2 characters")
.max(8,"Username must be no more than 8 characters")
.regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")

//  * SIGNUP VALIDATION BY ZOD  

export const signUpSchema = z.object({
    username : usernameValidation ,
    email : z.string().email({message:"Invalid Email Address"}),
    password : z.string().min(6,{message:"Password must be atleast 6 characters"})
})

