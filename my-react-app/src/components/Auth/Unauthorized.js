import {useLocation, Navigate} from 'react-router-dom'
import {useEffect} from 'react'

export default function Unauthorized(){
    const location = useLocation()
    const message = location.state 

    useEffect(() => {
        window.history.replaceState(null, "", location.pathname)
    }, [location.pathname])

    return(
        <>
        {message && <p>{message}</p>}
        </>
    );
}