import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute ({children, allowedRoles}) {
    const token = JSON.parse(localStorage.getItem('token'))
    if(!token){
        
        return <Navigate to='/login'/>
    }
    else{
        const currentTime = Math.floor(Date.now() / 1000);
        if (token.exp && token.exp < currentTime) 
        {                 
            return <Navigate to='/login'/>         
        } 
        else{     
            const role = token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
            if(!allowedRoles.includes(role)){
                return <Navigate to="../unauthorized" state={"You have to be authorized to view this page."}/>
            }
            else{ 
                if(allowedRoles[0] === 'prodavac'){ 
                    const userverified = JSON.parse(localStorage.getItem("userverified"))   
                    if(!(userverified === "True"))
                        return <Navigate to="../unauthorized" state={"To view this page your profile has to be verified."}/>     
                    else
                        return children;         
                }
                else{
                    return children; 
                }
            }
        }        
    }
};