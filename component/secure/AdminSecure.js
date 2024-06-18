import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import NavbarAdmin from '../Layout/NavbarAdmin'

const AdminSecure = (props) => {
    const router = useRouter()
    const [token, setToken] = useState("")
    const [adminData, setAdminData] = useState({})

    useEffect(() => {
      // const adminData = JSON.parse(localStorage.getItem("admin-data") || "{}");
      const adminData = JSON.parse(localStorage.getItem("admin-data"));
      console.log(adminData)
        if(!adminData || !adminData.authToken){
            router.push("/admin/login")
        } else {
            setToken(adminData.authToken)
            setAdminData(adminData)
        }
    },[])

    if(!token){
        return <p>Admin Loader...</p>
    }

  return (
    <>
      <NavbarAdmin NavbarData={adminData} />
      {props.children}
    </>
  )
}

export default AdminSecure
