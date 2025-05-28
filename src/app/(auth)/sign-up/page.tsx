'use client'

import React, { useEffect, useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import axios, { AxiosError } from 'axios'
import { LoaderCircle } from 'lucide-react';


import { useDebounceValue } from 'usehooks-ts'
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const page = () => {

  const [username, setUsername] = useState('');
  const [usernameMessage, setUserNameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounceUsername = useDebounceValue(username, 300);

  const router = useRouter();

  const form = useForm(
    {
      resolver: zodResolver(signUpSchema),
      defaultValues: {
        username: '',
        email: '',
        password: ''
      }
    }
  );

  // useEffect(() => {

  //   const checkUserUnique = async () => {
  //     console.log(debounceUsername)
  //   if (debounceUsername) {
  //     setIsCheckingUsername(true)
  //     setUserNameMessage('');

  //     try {
  //         const response = await axios.get(`/api/check-username-unique?username=${debounceUsername}`)
  //         setUserNameMessage(response.data.message)



  //     } catch (error) {
  //       const axiosError = error as AxiosError<ApiResponse>;
  //       setUserNameMessage(axiosError.response?.data.message ?? "Error in checking username")
  //     }finally{
  //       setIsCheckingUsername(false);
  //     }

  //   }

  // }

  // checkUserUnique();







  // }, [debounceUsername])

  const onSubmit = async (data:any) => {
    console.log(data)

    try {
      const response = await axios.post('/api/sign-up', data);
      console.log("Response == ", response.data);
      toast("Success", {
        description: response.data.message,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      router.replace(`/api/verify-code/${username}`)
    } catch (error) {
      console.error("Error in Signup")
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
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setUsername(e.target.value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder="Enter email" {...field}
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
                ) : ("Signup")
              }

            </Button>
          </form>

        </Form>
        <div className=" mt-4 text-center">
              <p>Already a member{''}
                <Link href='/sign-in' className='text-blue-600 hover:text-blue-800' >
                Sign-in
                </Link>
              </p>
        </div>
      </div>
    </div>
  )
}

export default page