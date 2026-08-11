import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

function Header() {
    return (
        <div className='flex items-center justify-between shadow-lg p-4'>
            <div>
                <h1 className='text-3xl font-bold'>Dashboard</h1>

            </div>
            <div>
                <SignedIn>
                    <UserButton />
                </SignedIn>

            </div>
        </div>

    )
}

export default Header