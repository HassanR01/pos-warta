'use client'
import Image from 'next/image'
import React, { useState } from 'react'

export default function CasherPage({ shift, items, User }) {
    const [category, setCategory] = useState('')
    const [invoices, setInvoices] = useState(shift.invoices)
    const [expenses, setExpenses] = useState(shift.expenses)
    const [showAddExpense, setShowAddExpense] = useState(false)
    const [alert, setAlert] = useState('')

    const FilterdItems = items.filter(item => {
        const matchedCategory = !category || item.category === category
        return matchedCategory
    })

    const clist = [...new Set(items.map(item => item.category))];

    const priceInTheBranch = (prices) => {
        let branchPrice = prices.find(price => price.branch === shift.branch)
        return +branchPrice?.price
    }

    const totalIncome = () => {
        let totalShiftIncome = 0
        invoices.map((invoice) => {
            totalShiftIncome = totalShiftIncome + invoice.total
        })
        return totalShiftIncome
    }

    const totalExpenses = () => {
        let totalShiftExpense = 0
        expenses.map(expense => {
            totalShiftExpense = totalShiftExpense + +expense.value
        })
        return totalShiftExpense
    }

    const totalRefund = () => {
        return totalIncome() - totalExpenses()
    }

    // Handle Expenses **********************
    const [reason, setreason] = useState('')
    const [value, setvalue] = useState(0)
    const [description, setdescription] = useState('')

    const expense = {
        reason: reason,
        value: value,
        description: description,
        user: User.name,
        branch: shift.branch,
    }


    const AddExpense = (e) => {
        e.preventDefault()

        if (value > 0) {
            const expensesHandle = [...expenses, expense]
            setExpenses(expensesHandle)
            setAlert('الرجاء تأكيد الصرف')
        } else {
            setAlert('كل البيانات مطلوبة')
        }
    }

    const sendExpense = async () => {
        setAlert('يتم مراجعة البيانات..')
        try {
            const resExpense = await fetch('/api/expenses', {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(expense)
            })

            const resShift = await fetch(`/api/shifts/${shift._id}`, {
                method: "PUT",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ expenses })
            })

            if (resShift.ok && resExpense.ok) {
                setAlert('')
                setShowAddExpense(false)
            }

        } catch (error) {
            console.log(error)
        }
    }










    // Handle Expenses **********************






    // Handle Invoice ************************
    const [itemsInOrder, setItemsInOrder] = useState([])
    const [quantity, setQuantity] = useState(1)
    const [discount, setDiscount] = useState(0)
    const [taxs, setTaxt] = useState(0)
    const [delivery, setDelivery] = useState(0)

    const AddItemToOrder = (title, price, quantity, category) => {
        const item = {
            title: title,
            price: price,
            category: category,
            quantity: quantity,
        }

        let itemsHandle = [...itemsInOrder, item]
        setItemsInOrder(itemsHandle)
    }

    const removeItemFromOrder = (ind) => {
        let itemsHandle = [...itemsInOrder]
        itemsHandle.splice(ind, 1)
        setItemsInOrder(itemsHandle)
    }

    // Payment Data
    const [showInvoice, setShowInvoice] = useState(false)
    const subTotalItems = (items) => {
        let totalItemsPrice = 0
        items.map(item => {
            totalItemsPrice = totalItemsPrice + (item.price * item.quantity)
        })
        return totalItemsPrice
    }

    const mainTotalItemsPrice = () => {
        let totalItemsPrice = subTotalItems(itemsInOrder)
        let mainTotal = (totalItemsPrice + delivery) - (discount)
        return mainTotal
    }

    const invoice = {
        client: 'take-away',
        items: [...itemsInOrder],
        total: mainTotalItemsPrice(),
        discount: discount,
        taxs: taxs,
        delivery: delivery,
        user: User.name,
        payment: 'Cash',
        branch: shift.branch,
    }

    const AddInvoice = () => {
        if (itemsInOrder.length > 0) {
            let invoicesHandle = [...invoices, invoice]
            setInvoices(invoicesHandle)
            setAlert('تم إنشاء الفاتورة')
            setShowInvoice(true)
        } else {
            setAlert('لا يوجد شيء في الفاتورة')
        }
    }

    const sendOrderAndPrint = async () => {

        try {
            const resInvoice = await fetch('/api/invoices', {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(invoice)
            })

            const resShift = await fetch(`/api/shifts/${shift._id}`, {
                method: "PUT",
                headers: {
                    "Content-type": 'application/json'
                },
                body: JSON.stringify({ invoices })
            })

            if (resInvoice.ok && resShift.ok) {
                setAlert('تم إنشاء الطلب بنجاح')
                setItemsInOrder([])
                setDiscount(0)
                setDelivery(0)
                window.print()
            }

        } catch (error) {
            console.log(error);
        }
    }


    // Handle Invoice ************************

    const FormatedDate = (date) => {
        const CreateDate = new Date(date)
        // Format the date
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        const formattedDate = CreateDate.toLocaleString('ar-EG', options);
        return formattedDate
    }

    return (
        <>
            <div className="data w-full flex items-center justify-center flex-wrap">
                <h2 className='text-mainColor text-xs m-2'>التاريخ: {FormatedDate(new Date())}</h2>
                <h2 className='text-mainColor text-xs m-2'>الكاشير:{User.name}</h2>
                <h2 className='text-mainColor text-xs m-2'>قام بفتح الوردية: {shift.casher}</h2>
            </div>
            <div className="options w-10/12 bg-mainColor p-1 mt-5 rounded-full flex items-center justify-center">
                <ul className='flex items-center justify-center w-full'>
                    <li onClick={() => setShowAddExpense(!showAddExpense)} className='p-2 text-bgColor cursor-pointer mx-2 hover:text-mainColor hover:bg-bgColor rounded-full'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg></li>
                    <li className='p-2 text-bgColor cursor-pointer mx-2 hover:text-mainColor hover:bg-bgColor rounded-full'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" /> </svg></li>
                    <li className='p-2 text-bgColor cursor-pointer mx-2 hover:text-mainColor hover:bg-bgColor rounded-full'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /> </svg></li>
                </ul>
            </div>
            <h2 className='font-bold text-2xl text-start w-full mt-5'>تفاصيل الوردية:</h2>
            <div className="Info flex items-center justify-center sm:justify-start flex-wrap my-5 w-full">
                <div className="info w-72 h-32 cursor-pointer flex flex-col m-2 items-start justify-between p-4 shadow-xl rounded-xl border bg-gray-100">
                    <h2 className='text-2xl font-bold'>الطلبات</h2>
                    <h3 className='text-xl text-yellow-800 font-bold'>{invoices.length} طلب</h3>
                    <div className="color w-full p-2 bg-yellow-500 rounded-full">
                    </div>
                </div>
                <div className="info w-72 h-32 cursor-pointer flex flex-col m-2 items-start justify-between p-4 shadow-xl rounded-xl border bg-gray-100">
                    <h2 className='text-2xl font-bold'>المصاريف</h2>
                    <h3 className='text-xl text-red-500 font-bold'>{totalExpenses()} ج.م</h3>
                    <div className="color w-full p-2 bg-red-500 rounded-full">
                    </div>
                </div>
                <div className="info w-72 h-32 cursor-pointer flex flex-col m-2 items-start justify-between p-4 shadow-xl rounded-xl border bg-gray-100">
                    <h2 className='text-2xl font-bold'>مجموع الدخل</h2>
                    <h3 className='text-xl text-blue-500 font-bold'>{totalIncome()} ج.م</h3>
                    <div className="color w-full p-2 bg-blue-500 rounded-full">
                    </div>
                </div>
                <div className="info w-72 h-32 cursor-pointer flex flex-col m-2 items-start justify-between p-4 shadow-xl rounded-xl border bg-gray-100">
                    <h2 className='text-2xl font-bold'>يوجد في الخزنة</h2>
                    <h3 className='text-xl text-green-500 font-bold'>{totalRefund()} ج.م</h3>
                    <div className="color w-full p-2 bg-green-500 rounded-full">
                    </div>
                </div>
            </div>
            <div className='w-full flex items-start justify-center flex-col lg:flex-row lg:justify-start my-5'>
                <div className={`itemsList w-full lg:w-8/12 lg:ml-5 border-mainColor rounded-xl p-2 border my-2 lg:my-0`}>
                    <div className="categoriesList flex flex-wrap justify-center items-center">
                        <ul className='flex w-full flex-center justify-center lg:justify-start flex-wrap'>
                            <li className={`cbtn ${category === "" ? "text-bgColor bg-black" : ' bg-bgColor text-blackColor'}`} onClick={() => setCategory('')}>الكل</li>
                            {clist.map((c, ind) => (
                                <li key={ind} className={`cbtn ${category === c ? "text-bgColor bg-black" : ' bg-bgColor text-blackColor'}`} onClick={() => setCategory(c)}>{c}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="itemsList my-10 flex items-center justify-center lg:justify-start flex-wrap w-full">
                        {FilterdItems.map((item, ind) => (
                            <div className="item flex flex-col items-center justify-center p-2 m-1 lg:m-3 border-2 border-black rounded-xl w-40 hover:shadow-xl duration-700 cursor-pointer" key={ind}>
                                <Image src={item.category === 'برجر' ? "/burger.png" : item.category === 'فرايز' ? "/fries.png" : item.category === "وجبات" ? "/meal.png" : "/offer.png"} width={50} height={50} alt='Item Icon' />
                                <h2 className='text-center text-xs my-1'>{item.title}</h2>
                                <h2 className='font-bold'>{priceInTheBranch(item.prices)} ج.م</h2>
                                <div className="AddQuantity flex justify-center items-center mt-2">
                                    <div className="quantity flex items-center justify-center">
                                        <div onClick={() => setQuantity(quantity + 1)} className="QBtn p-1 rounded-xl flex items-center justify-center border-2 border-blackColor hover:bg-blackColor hover:text-bgColor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> </svg></div>
                                        <h3 className='text-xl mx-2'>{quantity}</h3>
                                        <div onClick={() => {
                                            if (quantity >= 2) {
                                                setQuantity(quantity - 1)
                                            }
                                        }} className="QBtn p-1 rounded-xl flex items-center justify-center border-2 border-blackColor hover:bg-blackColor hover:text-bgColor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                                        </div>
                                    </div>
                                    <div onClick={() => {
                                        AddItemToOrder(item.title, priceInTheBranch(item.prices), quantity, item.category)
                                        setQuantity(1)
                                    }} className="icon flex items-center justify-center p-1 sm:p-1 rounded-full hover:shadow-xl duration-700 bg-black text-bgColor cursor-pointer mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">   <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /> </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* تفاصيل الدفع */}
                <div className="CheckoutCash w-full lg:w-auto lg:min-w-96 border-mainColor rounded-xl p-3 border">
                    <h2>تفاصيل الطلب:</h2>
                    <div className="orderItemsList w-full min-h-72 bg-slate-100 p-1 rounded-xl my-3">
                        {itemsInOrder.map((item, ind) => (
                            <div className="item p-1 my-1 bg-bgColor rounded-xl flex items-center justify-between w-full" key={ind}>
                                <div className="image flex ml-2 items-center justify-center p-2 rounded-xl bg-yellow-500">
                                    <Image src={item.category === 'برجر' ? "/burger.png" : item.category === 'فرايز' ? "/fries.png" : item.category === "وجبات" ? "/meal.png" : "/offer.png"} width={50} height={50} alt='Item Icon' />
                                </div>
                                <div className="details h-full flex flex-col items-center justify-between p-2">
                                    <h4 className='mb-1'>{item.title}</h4>
                                    <p className='text-xs text-gray-400'>{+item.price} * {item.quantity} = {item.price * item.quantity}</p>
                                </div>
                                <div className='DeleteItem flex items-center justify-end'>
                                    <div onClick={() => removeItemFromOrder(ind)} className="deleteBtn p-2 rounded-xl cursor-pointer items-center bg-black text-red-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">   <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /> </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <h2>تفاصيل الدفع:</h2>
                    <div className="payment border-t-2 my-2 px-1 py-2 text-sm">
                        <div className="flex items-center mb-2 justify-between w-full">
                            <h3 className='font-semibold'>المجموع الصافي</h3>
                            <h3>{subTotalItems(itemsInOrder)} ج.م</h3>
                        </div>
                        <div className="flex items-center mb-2 justify-between w-full">
                            <h3 className='font-semibold'>توصيل</h3>
                            <div className="Delevery flex items-center justify-center">
                                <div onClick={() => setDelivery(delivery + 5)} className="QBtn p-1 rounded-xl flex items-center justify-center border-2 border-blackColor hover:bg-blackColor hover:text-bgColor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> </svg></div>
                                <h3 className=' mx-2'>{delivery}</h3>
                                <div onClick={() => {
                                    if (delivery >= 5) {
                                        setDelivery(delivery - 5)
                                    }
                                }} className="QBtn p-1 rounded-xl flex items-center justify-center border-2 border-blackColor hover:bg-blackColor hover:text-bgColor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center mb-8 justify-between w-full">
                            <h3 className='font-semibold'>خصم</h3>
                            <div className="Delevery flex items-center justify-center">
                                <div onClick={() => setDiscount(discount + 5)} className="QBtn p-1 rounded-xl flex items-center justify-center border-2 border-blackColor hover:bg-blackColor hover:text-bgColor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /> </svg></div>
                                <h3 className=' mx-2'>{discount}</h3>
                                <div onClick={() => {
                                    if (discount >= 5) {
                                        setDiscount(discount - 5)
                                    }
                                }} className="QBtn p-1 rounded-xl flex items-center justify-center border-2 border-blackColor hover:bg-blackColor hover:text-bgColor"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="flex font-bold text-lg items-center justify-between w-full ">
                            <h3>اجمالي الفاتورة</h3>
                            <h3>{mainTotalItemsPrice()} ج.م</h3>
                        </div>
                    </div>
                    <button onClick={() => AddInvoice()} className='submitBtn w-full'>{alert ? alert : "إنشاء الفاتورة"}</button>
                </div>
            </div>
            <div className={`InvoiceContainer absolute overflow-hidden top-0 left-0 bg-white flex flex-col items-center justify-center ${showInvoice ? "w-full h-full rounded-none" : "w-0 h-0  rounded-xl"} duration-700`}>
                {showInvoice && <button onClick={() => setShowInvoice(!showInvoice)} className='text-red-500 bg-mainColor p-2 rounded-xl absolute top-5 left-5'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>}
                <div className="Invoice w-80 p-3 rounded-xl flex items-center justify-center flex-col border-2 border-mainColor">
                    <div className="head flex items-center justify-between w-full">
                        <Image src={'/bwLogo.png'} width={80} height={80} alt='logo' />
                        <div className="date">
                            <h2>التاريخ:</h2>
                            <p>{FormatedDate(new Date())}</p>
                        </div>
                    </div>
                    <div className="body w-full">
                        <div className="items w-full flex flex-col justify-start items-start my-3">
                            {itemsInOrder.map((item, ind) => (
                                <div className="item flex flex-row w-full justify-between items-center my2" key={ind}>
                                    <div className="title flex flex-col items-start justify-center">
                                        <h2 className='font-medium'>{item.title}</h2>
                                        <p className='text-sm text-gray-400'>{+item.price} * {item.quantity}</p>
                                    </div>
                                    <div className="price">
                                        <h2>L.E {item.price * item.quantity}</h2>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="total text-sm flex flex-col w-full">
                            <div className="flex items-center mb-2 justify-between w-full">
                                <h3 className='font-semibold'>المجموع الصافي</h3>
                                <h3>{subTotalItems(itemsInOrder)} L.E</h3>
                            </div>
                            {delivery > 0 && (
                                <div className="flex items-center mb-2 justify-between w-full">
                                    <h3 className='font-semibold'>التوصيل</h3>
                                    <h3>{delivery} L.E</h3>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="flex items-center mb-2 justify-between w-full">
                                    <h3 className='font-semibold'>الخصم</h3>
                                    <h3>{discount} L.E</h3>
                                </div>
                            )}
                            <div className="flex font-bold text-lg border-t-2 pt-1 items-center mb-2 justify-between w-full">
                                <h3 className='font-semibold'>إجمالي الفاتورة</h3>
                                <h3>{mainTotalItemsPrice()} L.E</h3>
                            </div>
                        </div>
                        <div className="foot">
                            <h6 className='text-xs text-gray-700'>الكاشير: {User.name}</h6>
                        </div>
                    </div>
                </div>
                <button onClick={() => sendOrderAndPrint()} className='submitBtn w-80'>طباعة الفاتورة</button>
            </div>

            <div className={`AddExpenseContainer absolute overflow-hidden top-0 left-0 bg-white flex flex-col items-center justify-center ${showAddExpense ? "w-full h-full rounded-none" : "w-0 h-0  rounded-xl"} duration-700`}>
                {showAddExpense && <button onClick={() => setShowAddExpense(!showAddExpense)} className='text-red-500 bg-mainColor p-2 rounded-xl absolute top-5 left-5'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>}
                <form onSubmit={AddExpense}>
                    <div className="reason w-full mb-3 lg:mb-5">
                        <label className='text-xl font-semibold' htmlFor="reason">أذكر سبب الصرف:</label>
                        <input className='w-full my-2' type="text" name="reason" value={reason} onChange={(e) => setreason(e.target.value)} id="title" placeholder='سبب الصرف' />
                    </div>
                    <div className="value w-full mb-3 lg:mb-5">
                        <label className='text-xl font-semibold' htmlFor="value">قيمة الصرف:</label>
                        <input className='w-full my-2' type="number" name="value" value={value} onChange={(e) => setvalue(e.target.value)} id="title" placeholder='القيمة' />
                    </div>
                    <div className="description w-full mb-3 lg:mb-5">
                        <label className='text-xl font-semibold' htmlFor="description">تفاصيل اخرى :</label>
                        <textarea className='my-2 w-full' name="description" id="description" value={description} onChange={(e) => setdescription(e.target.value)} placeholder='تفاصيل اخرى'></textarea>
                    </div>
                    <button className='submitBtn w-full'>{alert ? alert : "إضافة الصرف"}</button>
                </form>
                <div className="btns w-80 mt-3">
                    <button onClick={() => sendExpense()} className='submitBtn'>تأكيد الصرف</button>
                </div>
            </div>

        </>
    )
}