'use client'

import React, {  useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { LoaderCircle } from 'lucide-react';


import { useRouter } from 'next/navigation'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'

const Page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);


  const router = useRouter();

  const form = useForm(
    {
      resolver: zodResolver(signInSchema),
      defaultValues: {
        identifier: '',
        password: ''
      }
    }
  );


  const onSubmit = async (data:any) => {
    console.log(data)

    try {
      setIsSubmitting(true);
     const response = await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      });
  

      if(response?.error)
      {
        toast("Error in Signin",{
          description:response.error
        })
      }
      if(response?.ok)
      {
       router.push(`/dashboard`)
            console.log("Response of Sign-In",response);  
      }

    } catch (error) {
      setIsSubmitting(true)
      console.error("Error in Signup",error)
      toast("Error in Signup")
    } finally {
      setIsSubmitting(false)
    }

  }



  return (
    <div className='flex justify-center items-center h-screen w-full bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join Mystery Message</h1>
          <p className='mb-4'>
            Sign up to start your anonymous adventure
          </p>
        </div>
        <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' >
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder="Enter email / Username" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter password" {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isSubmitting}>

              {
                isSubmitting ? (
                  <>
                    <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                  </>
                ) : ("Signin")
              }

            </Button>
          </form>

        </Form>
        <div className=" mt-4 text-center">
              <p>New  member{''}
                <Link href='/sign-up' className='text-blue-600 hover:text-blue-800' >
                Sign-up
                </Link>
              </p>
        </div>
      </div>
    </div>
  )
}

export default Page