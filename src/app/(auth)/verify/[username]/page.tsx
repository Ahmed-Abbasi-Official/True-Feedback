"use client"

import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader, LoaderCircle } from 'lucide-react';

const VerifyAccount = () => {
    const [isSubmitting,setIsSubmitting] = useState(false);
    const router = useRouter();
    const param = useParams<{username:string}>();

    const form = useForm<z.infer<typeof verifySchema>>(
        {
            resolver:zodResolver(verifySchema),
        }
    );

    const onSubmit = async (data:z.infer<typeof verifySchema>)=>
        {
            console.log(data);
            try {
                setIsSubmitting(true);
                const response = await axios.post('/api/verify-code',{
                    username:param.username,
                    code:data.code
                });

                 toast("Success", {
                        description: response.data.message,
                        action: {
                          label: "Undo",
                          onClick: () => console.log("Undo"),
                        },
                      });

                      router.replace('/sign-in')

            } catch (error) {
                setIsSubmitting(true);
                 const axiosError = error as AxiosError<ApiResponse>;
                        console.log("error in verification : ",error)
            }finally{
                setIsSubmitting(false);
            }
        } 


  return (
    <div  className='flex justify-center items-center h-screen w-full bg-gray-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Verify your Account</h1>
          <p className='mb-4'>
            Verification Code sent to your email
          </p>
        </div>


        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
            {
                isSubmitting ? (
                    <>
                    Please wait : <LoaderCircle/>
                    </>
                ) : ("Submit")
            }
        </Button>
      </form>
    </Form>

        </div>
    </div>
  )
}

export default VerifyAccount