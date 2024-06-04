'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import AddBranch from './AddBranch'
import Image from 'next/image'

export default function BranchesList() {
    const [branches, setBranches] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [openAddBranch, setOpenAddBranch] = useState(false)

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
                    transition={{ duration: 0.6 }}
                    className="BranchesListContainer w-full lg:w-11/12 h-5/6 p-3 bg-slate-200 rounded-2xl"
                >
                    <div className="head flex items-center justify-between flex-wrap my-10">
                        <div className="addBtns flex items-center justify-center w-full lg:w-auto">
                            <button onClick={() => setOpenAddBranch(!openAddBranch)} className='addBtn'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 ${openAddBranch ? "rotate-45": ''}`}>   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> </svg> إضافة فرع</button>
                        </div>
                    </div>

                    {openAddBranch ? (
                        <>
                           <AddBranch /> 
                        </>
                    ) : (
                            <>
                                <div className="branches">
                                    {branches.map((branch, ind) => (
                                        <div key={ind} className="branch flex flex-col items-center justify-center">
                                            <Image src={"/branch.png"} width={100} height={100} alt='Branch' />
                                            <h3>{branch.name}</h3>
                                            <h3>{branch.phone}</h3>
                                            <p className='text-xs'>{branch.location}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                    )}

                </motion.div>

                
            </>
        )
    }
}
