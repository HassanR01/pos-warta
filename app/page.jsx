'use client'

import { useRouter } from "next/navigation";
import Mainpage from "./components/dashboard/Mainpage";

export default function Home() {
  const router = useRouter()
  let x = true

  if (!x) {
    router.push('/dashboard')

  } else {

    return (
      <Mainpage />
    );
  }
}
