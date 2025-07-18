'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'

import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
    const { data: session } = useSession();

    const user: User = session?.user as User;

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a href="#" className='text-xl font-bold mb-4 md:mb-0'>Mystry Message</a>
                {
                    session ? (
                        <>
                            <span className='mr-4'>Welcome {user?.username || user?.email}</span>
                            <Button className='w-full md:m-auto' onClick={() => signOut()}>
                                SignOut
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href='/sign-in'>
                                <Button className='w-full md:m-auto'>
                                    Sign-in
                                </Button>
                            </Link>
                        </>
                    )
                }
            </div>
        </nav>
    )
}

export default Navbar