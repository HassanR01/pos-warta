'use client'
import React, { useEffect, useState } from 'react'
import DateRangePicker from './DateRangePicker';
import Loading from '../main/Loading'


export default function DashboardPage({ User }) {
    const [expenses, setExpenses] = useState(null)
    const [filteredexpenses, setFilteredexpenses] = useState([])
    const [invoices, setInvoices] = useState(null)
    const [filteredinvoices, setFilteredinvoices] = useState([])
    const [salaries, setSalaries] = useState(null)
    const [filteredsalaries, setFilteredsalaries] = useState([])
    const [shifts, setShifts] = useState(null)
    const [filteredshifts, setFilteredshifts] = useState([])
    const [branches, setBranches] = useState(null)

    const [isLoading, setIsLoading] = useState(true)
    const [filterBranch, setFilterBranch] = useState("")

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [startDate, setStartDate] = useState(startOfDay);
    const [endDate, setEndDate] = useState(now);

    const GetData = async () => {
        try {
            const resexpenses = await fetch(`/api/expenses`, {
                cache: 'no-store'
            })

            const expensesResult = await resexpenses.json()
            setExpenses(expensesResult.expenses)

            const resinvoices = await fetch(`/api/invoices`, {
                cache: 'no-store'
            })

            const invoicesResult = await resinvoices.json()
            setInvoices(invoicesResult.invoices)

            const ressalaries = await fetch(`/api/salaries`, {
                cache: 'no-store'
            })

            const salariesResult = await ressalaries.json()
            setSalaries(salariesResult.salaries)

            const resbranches = await fetch(`/api/branches`, {
                cache: 'no-store'
            })

            const branchesResult = await resbranches.json()
            setBranches(branchesResult.branches)

            const resshifts = await fetch(`/api/shifts`, {
                cache: 'no-store'
            })

            const shiftsResult = await resshifts.json()
            setShifts(shiftsResult.shifts)

            if (resshifts.ok && resexpenses.ok && resinvoices.ok && ressalaries.ok && resbranches.ok) {
                if (startDate && endDate) {
                    filterData(startDate, endDate);
                }
            }

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        GetData()


        const refresh = setInterval(GetData, 2000)
        return () => clearInterval(refresh)
    }, [startDate, endDate, filterBranch]);




    const filterData = (start, end) => {
        const filteredExp = expenses.filter(expense => {
            const expDate = new Date(expense.createdAt);
            if (filterBranch !== "All") {
                const branchFilter = expense.branch === filterBranch
                return expDate >= start && expDate <= end && branchFilter;
            } else {
                return expDate >= start && expDate <= end;
            }
        });

        const filteredInv = invoices.filter(invoice => {
            const invoiceDate = new Date(invoice.createdAt);
            if (filterBranch !== "All") {
                const branchFilter = invoice.branch === filterBranch
                return invoiceDate >= start && invoiceDate <= end && branchFilter;
            } else {
                return invoiceDate >= start && invoiceDate <= end;
            }
        });

        const filteredSly = salaries.filter(salary => {
            const salaryDate = new Date(salary.createdAt);
            if (filterBranch !== "All") {
                const branchFilter = salary.branch === filterBranch
                return salaryDate >= start && salaryDate <= end && branchFilter;
            } else {
                return salaryDate >= start && salaryDate <= end;
            }
        });

        const filteredShft = shifts.filter(shift => {
            const shiftDate = new Date(shift.updatedAt);
            const closed = shift.status === 'close'
            if (filterBranch !== "All") {
                const branchFilter = shift.branch === filterBranch
                return shiftDate >= start && shiftDate <= end && closed && branchFilter;
            } else {
                return shiftDate >= start && shiftDate <= end && closed;
            }
        });

        setFilteredexpenses(filteredExp)
        setFilteredinvoices(filteredInv)
        setFilteredsalaries(filteredSly)
        setFilteredshifts(filteredShft)
    };

    const handleDateChange = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };





    if (isLoading) {
        return <Loading />
    } else {

        let branchesName = []
        branches.map(branch => {
            branchesName.push(branch.name)
        })

        const TotalIncome = () => {
            let totalIncome = 0
            filteredinvoices.map(inv => {
                totalIncome = totalIncome + +inv.total
            })
            return totalIncome
        }

        const TotalExp = () => {
            let totalExp = 0
            filteredexpenses.map(exp => {
                totalExp = totalExp + +exp.value
            })
            return totalExp
        }

        const TotalSly = () => {
            let totalSly = 0
            filteredsalaries.map(salary => {
                totalSly = totalSly + +salary.salary
            })
            return totalSly
        }

        const TotalRefunds = () => {
            let totalRefund = TotalIncome() - (TotalExp() + TotalSly())
            return totalRefund
        }

        return (
            <>
                <div className="filterBar">
                    <DateRangePicker onDateChange={handleDateChange} />
                    <div className="description w-full mb-3 lg:mb-5">
                        <select className='my-2 w-full' name="branch" id="branch" value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
                            <option value="">اختر الفرع</option>
                            {branchesName.map((branch, ind) => (
                                <option key={ind} value={branch}>{branch}</option>
                            ))}
                            <option value="All">الكل</option>
                        </select>
                    </div>
                </div>

                <div className="Info flex items-center justify-center sm:justify-start flex-wrap my-5 w-full">
                    <div className="info w-72 h-32 cursor-pointer flex flex-col m-2 items-start justify-between p-4 shadow-xl rounded-xl border bg-mainColor text-bgColor">
                        <h2 className='text-2xl font-bold'>مجموع الدخل</h2>
                        <h3 className='text-xl text-blue-300 font-bold'>{TotalIncome()} ج.م</h3>
                        <div className="color w-full p-2 bg-blue-500 rounded-full">
                        </div>
                    </div>
                    <div className="info w-72 h-32 cursor-pointer flex flex-col m-2 items-start justify-between p-4 shadow-xl rounded-xl border bg-mainColor text-bgColor">
                        <h2 className='text-2xl font-bold'>المصاريف</h2>
                        <h3 className='text-xl text-red-500 font-bold'>{TotalExp()} ج.م</h3>
                        <div className="color w-full p-2 bg-red-500 rounded-full">
                        </div>
                    </div>
                    <div className="info w-72 h-32 cursor-pointer flex flex-col m-2 items-start justify-between p-4 shadow-xl rounded-xl border bg-mainColor text-bgColor">
                        <h2 className='text-2xl font-bold'>مرتبات</h2>
                        <h3 className='text-xl text-pink-500 font-bold'>{TotalSly()} ج.م</h3>
                        <div className="color w-full p-2 bg-pink-500 rounded-full">
                        </div>
                    </div>
                    <div className="info w-72 h-32 cursor-pointer flex flex-col m-2 items-start justify-between p-4 shadow-xl rounded-xl border bg-mainColor text-bgColor">
                        <h2 className='text-2xl font-bold'>إجمالي العائدات</h2>
                        <h3 className='text-xl text-green-500 font-bold'>{TotalRefunds()} ج.م</h3>
                        <div className="color w-full p-2 bg-green-500 rounded-full">
                        </div>
                    </div>
                    <div className="info w-72 h-32 cursor-pointer flex flex-col m-2 items-start justify-between p-4 shadow-xl rounded-xl border bg-mainColor text-bgColor">
                        <h2 className='text-2xl font-bold'>الطلبات</h2>
                        <h3 className='text-xl text-yellow-500 font-bold'>{filteredinvoices.length} طلب</h3>
                        <div className="color w-full p-2 bg-yellow-500 rounded-full">
                        </div>
                    </div>
                    <div className="info w-72 h-32 cursor-pointer flex flex-col m-2 items-start justify-between p-4 shadow-xl rounded-xl border bg-mainColor text-bgColor">
                        <h2 className='text-2xl font-bold'>الورديات</h2>
                        <h3 className='text-xl text-cyan-300 font-bold'>{filteredshifts.length} وردية</h3>
                        <div className="color w-full p-2 bg-cyan-500 rounded-full">
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
