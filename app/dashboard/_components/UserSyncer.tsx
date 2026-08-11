"use client"
import { useUser } from '@clerk/nextjs'
import axios from "axios"
import { useEffect } from 'react'

export default function UserSyncer() {
    const { user } = useUser()
    useEffect(() => {
        user && createNewUser()
    }, [user])

    const createNewUser = async () => {
        await axios.post("/api/user", {
            name: user?.fullName,
            email: user?.primaryEmailAddress?.emailAddress
        })
    }

    return null
}
