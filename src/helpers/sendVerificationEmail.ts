import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'True Feedback | Verification Code',
            react: VerificationEmail({username,otp:verifyCode}),
          });

        return {success:true , message:"Verification email send Successfully!"}
    } catch (emailError) {
        console.error("Error in sending Email",emailError);
        return {success:false , message:"Verification email send failed"}
    }
}