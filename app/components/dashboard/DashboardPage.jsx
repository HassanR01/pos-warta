'use client'
import React, { useEffect, useState } from 'react'
import Loading from '../main/Loading'

export default function DashboardPage({ User }) {
    const [expenses, setExpenses] = useState(null)
    const [invoices, setInvoices] = useState(null)
    const [salaries, setSalaries] = useState(null)
    const [branches, setBranches] = useState(null)
    const [shifts, setShifts] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [filterDate, setFilterDate] = useState('')
    const [filterBranch, setFilterBranch] = useState(User.branch)

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
                (setSalariessalariesResult.salaries)

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
    }, [])


    if (isLoading) {
        return <Loading />
    } else {

        




        return (
            <div>DashboardPage</div>
        )
    }
}
