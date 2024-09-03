import {useEffect, useState} from 'react'
import './Dashboard.css'


export default function Dashboard(){

    const [name, setName] = useState("")
    const [verified, setVerified] = useState("")
    const [usertype, setusertype] = useState("")

    useEffect(() => {
        const userprofile = JSON.parse(localStorage.getItem("username"))
        if(userprofile)
            setName(userprofile)
        const token = JSON.parse(localStorage.getItem("token"))
        if(token)
            setusertype(token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
        const verify = JSON.parse(localStorage.getItem('userverified'))
        if(verify==="True")
            setVerified("Verified")
        else if(verify==="False")
            setVerified('Pending')
        else if(verify==="null")
            setVerified("Denied")
    },[])


    return(
       <div className='dashboard-container'>
       <h1 className='main-title'>Welcome, {name}!</h1>
        {usertype==="prodavac" && <h3 className='second-title'>Your profile verification status is: {verified}</h3>}
       </div>
    );
}