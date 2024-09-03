import './Login.css';
import { useState } from 'react';
import { GoogleLoginService, LoginService } from '../services/AuthService'
import { useNavigate } from 'react-router-dom';
import  reactimage  from '../../images/illuminati.png'
import inputEmailIcon from '../../images/emailsvg.svg'
import inputPasswordicon from '../../images/passwordsvg.svg'
import googleLogoIcon from '../../images/googlelogo.svg'
import {toast} from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google';
import jwt from 'jsonwebtoken'

export default function Login() {

  const nav = useNavigate()
  const [changeEmailClassValidation, setChangeEmailClassValidation] = useState(false)
  const [changePasswordClassValidation, setChangePasswordClassValidation] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();

    setChangeEmailClassValidation(false)
    setChangePasswordClassValidation(false)

    const password = event.target.loginpassword.value;
    const email = event.target.loginemail.value;

    if (email.trim() === "") {
      setChangeEmailClassValidation(true)
      event.target.loginemail.focus()
      toast.warning("Please enter your email")
    }
    else if (password.trim() === "") {
      setChangePasswordClassValidation(true)
      event.target.loginpassword.focus()
      toast.warning("Please enter your password")
    }
    else {
      const data = { Email: email, Password: password }
      loginuser(data, nav)
    }
  }
  const loginuser = async (data, nav) => {
    const resp = await LoginService(data, nav);
  }

  const googleloginuser = async(data, nav) => {
    const resp = await GoogleLoginService(data, nav);
  }

  const successGoogleRegister = (response) => {
    const decodedToken = jwt.decode(response.credential)
    const data = {email:decodedToken.email, token:response.credential}
    googleloginuser(data, nav)
  }

  const errorGoogleRegister = (response) => {
    toast.error(response)
  }

  return (
    <form className="form_container" onSubmit={handleSubmit}>
      <div className="logo_container"><img src={reactimage} alt="no image" height={90} width={90}/></div>
      <div className="title_container">
        <p className="title">Login to your account</p>
        <span className="subtitle">Get started with our app, just sign in to your account and enjoy the experience.</span>
      </div>
      <br />
      <div className="input_container">
        <label className="input_label" >Email</label>
        <img src={inputEmailIcon} alt="" className='icon'/>
        <input placeholder="name@mail.com" name="loginemail" type="email" className={changeEmailClassValidation ?  "input_field_wrong" : "input_field"}/>

      </div>

      <div className="input_container">
        <label className="input_label">Password</label>
        <img src={inputPasswordicon} alt="" className='icon'/>
        <input placeholder="Password" name="loginpassword" type="password" className={changePasswordClassValidation ?  "input_field_wrong" : "input_field"}/>
      </div>
      <button type="submit" className="sign-in_btn">Sign In</button>

      <div className="separator">
        <hr className="line" />
        <span>Or</span>
        <hr className="line" />
      </div>

      {/* <button type="submit" className="sign-in_btn">
        <img src={googleLogoIcon} alt="" height="18" width="18"/>
        &nbsp; Sign In with Google
      </button> */}

      <GoogleLogin
          onSuccess={successGoogleRegister}
          onFailure={errorGoogleRegister}
          />
      
      <p className="note">Not registered yet?{" "}
                <a href="/registration">Sign Up</a></p>
    </form>
  )  
}