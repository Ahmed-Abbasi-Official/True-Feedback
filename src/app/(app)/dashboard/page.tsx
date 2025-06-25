'use client'
import { Message } from '@/model/User.model'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Axis3D } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const page = () => {
  const [messages,setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId:string)=>{
    setMessages(messages.filter((messages)=>messageId !== messages._id))
  };

  const {data:session}=useSession();

  const form = useForm({
    resolver:zodResolver(AcceptMessageSchema)
  });

  const {register , watch, setValue}=form;

  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async()=>{
    setIsSwitchLoading(true);
    try {
      const response = await axios.get('/api/accept-messages');
      setValue('acceptMessages',response.data.isAcceptingMessage)

    } catch (error) {
      console.log('Error in accepting Messages : ',error)
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error in Fetching Messages :");

    }finally{
      setIsSwitchLoading(false);
    }
  },[setValue]);

  const fetchMessages = useCallback(async(refresh:boolean = false)=>{
    setIsSwitchLoading(true);
    setIsLoading(true);
    try {
      const response = await axios.get('/api/get-messages');
      setMessages(response.data.Messages ||[]);
      if(refresh)
      {
        toast('refreshed Messages');
      }
    } catch (error) {
      console.log('Error in Fetching Messages : ',error)
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error in Fetching Messages :");
    }
    finally{
      setIsSwitchLoading(false);
      setIsLoading(false)
    }
  },[setIsLoading,setMessages]);

  useEffect(()=>{
    if(!session || !session.user) return;
    fetchAcceptMessage();
    fetchMessages();
  },[session,setValue,fetchAcceptMessage,fetchMessages])

  const handleSwitchChange = async () => {
   try {
    const response = await axios.post('/api/accept-messages',{
      acceptMessages:!acceptMessages
    })
    setValue('acceptMessages', !acceptMessages)
    toast(response.data.message)
   } catch (error) {
    
   }
  };

  if(!session || !session.user)
  {
    return <div>
      please Login
    </div>
  }

  return (
    <div>page</div>
  )
}

export default page