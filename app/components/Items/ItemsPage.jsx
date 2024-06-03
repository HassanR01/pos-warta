'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
export default function ItemsPage() {
    const [filter, setfilter] = useState('')
    const [category, setCategory] = useState('')

    const clist = ['برجر', 'فرايز', 'إضافات', 'وجبات', 'عروض']

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="itemsListContainer w-full lg:w-11/12 h-5/6 p-3 bg-slate-200 rounded-2xl"
            >
                <div className="head flex items-center justify-between flex-wrap my-10">
                    <div className="searchbar flex items-center justify-center w-full lg:w-auto mb-2">
                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg> */}
                        <input type="text" name="filter" id="filter" value={filter} onChange={(e) => setfilter(e.target.value)} placeholder='ابحث عن عنصر في المنيو' />
                    </div>
                    <div className="addBtns flex items-center justify-center">
                        <button className='addBtn'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> </svg> إضافة صنف</button>
                        <button className='addBtn'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> </svg> إضافة عنصر</button>
                    </div>
                </div>
                <div className="categoriesList flex flex-wrap">
                    <ul className='flex w-full flex-center justify-start flex-wrap'>
                        <li className={`cbtn ${category === "" ? "text-bgColor bg-black" : ' bg-bgColor text-blackColor'}`} onClick={() => setCategory('')}>الكل</li>
                        {clist.map((c, ind) => (
                            <li key={ind} className={`cbtn ${category === c ? "text-bgColor bg-black" : ' bg-bgColor text-blackColor'}`} onClick={() => setCategory(c)}>{c}</li>
                        ))}
                    </ul>
                </div>
                <div className="itemsList">

                </div>
            </motion.div>
        </>
    )
}
