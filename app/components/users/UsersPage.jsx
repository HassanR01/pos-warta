'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function UsersPage() {
    const [users, setusers] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await fetch('/api/users', {
                    cache: 'no-store'
                })

                const users = await res.json()
                setusers(users.users)

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }

        getUsers()
    }, [])

    if (isLoading) {
        return null
    } else {

        return (
            <>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="usersListContainer w-full lg:w-11/12 h-5/6 p-3 bg-slate-200 rounded-2xl"
                >
                    <div className="head flex items-center justify-between flex-wrap my-10">
                        <div className="addBtns flex items-center justify-center">
                            <button className='addBtn'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> </svg> إضافة مستخدم</button>
                        </div>
                    </div>
                    <div className="usersList">
                        {users.map(user => (
                            <h2>{ user.name }</h2>
                        ))}
                    </div>
                </motion.div>
            </>
        )
    }
}
