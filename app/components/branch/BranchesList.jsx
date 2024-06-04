'use client'
import React, { useEffect, useState } from 'react'

export default function BranchesList() {
    const [branches, setBranches] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getBranches = async () => {
            try {
                const res = await fetch('/api/branches' , {
                    cache: "no-store"
                })
                const result = await res.json()
                setBranches(result.branches)
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }

        getBranches()
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
                </motion.div>
            </>
        )
    }
}
