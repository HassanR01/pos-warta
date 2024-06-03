'use client'

import { useRouter } from "next/navigation";
import Mainpage from "./components/dashboard/Mainpage";
import { useEffect, useState } from "react";

export default function Home() {
  const [uesr, setuser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const usersession = sessionStorage.getItem("User")
    if (usersession) {
      setuser(JSON.parse(usersession))
      setIsLoading(false)
    } else {
      router.push('/login')
    }
  }, [])

  if (isLoading) {
    return null
  } else {


    return (
      <Mainpage />
    );
  }
}
