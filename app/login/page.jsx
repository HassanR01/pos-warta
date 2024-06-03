'use client'
import Image from 'next/image'
import BgImageLogin from '../../public/loginbgPhone.svg'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function page() {
  const [users, setusers] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')

  const router = useRouter()

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

    const user = users.filter(user => {
      const usernameMatched = user.username === username
      return usernameMatched
    })

    const signIn = (e) => {
      e.preventDefault()
      if (user[0].username === username && user[0].password == password) {
        sessionStorage.setItem('User', JSON.stringify(user[0]))
        console.log('تم تسجيل الدخول');
        router.push('/')
      } else {
        console.log("هذا المستخدم غير موجود");
      }
    }

    return (
      <section className='w-full h-full flex items-center justify-center p-5' style={{
        backgroundImage: `url(${BgImageLogin.src})`,
        backgroundSize: 'cover',
        backgroundPosition: "Center",
      }}>
        <div className="loginForm w-full lg:w-8/12 bg-bgColor p-5 rounded-2xl shadow-2xl border">
          <div className="head flex items-center justify-between mb-5 lg:mb-10">
            <h2 className='text-base lg:text-2xl'>تسجيل دخول للمسخدمين المسجلين فقط</h2>
            <Image src={'/wartaLogo.png'} width={100} height={100} alt='WartLogo' />
          </div>
          <form onSubmit={signIn}>
            <div className="username w-full mb-3 lg:mb-5">
              <label className='text-xl font-semibold' htmlFor="username">اسم المستخدم:</label>
              <input className='w-full my-2' type="text" name="username" value={username} onChange={(e) => setusername(e.target.value)} id="username" placeholder='اسم المستخدم' />
            </div>
            <div className="password w-full mb-3 lg:mb-5">
              <label className='text-xl font-semibold' htmlFor="password">كلمة المرور:</label>
              <input className='w-full my-2' type="password" name="password" value={password} onChange={(e) => setpassword(e.target.value)} id="password" placeholder='اسم المستخدم' />
            </div>
            <button className='submitBtn' type='submit'>تسجيل دخول</button>
          </form>
        </div>
      </section>
    )
  }
}
