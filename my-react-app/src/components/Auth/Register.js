import './Register.css';
import { useState } from 'react';
import { GoogleRegisterService, RegisterService } from '../services/AuthService'
import { useNavigate } from 'react-router-dom'
import reactimage from '../../images/illuminati.png'
import inputEmailIcon from '../../images/emailsvg.svg'
import inputPasswordicon from '../../images/passwordsvg.svg'
import { toast } from 'react-toastify'
import noimage from '../../images/noimage.svg'
import userimage from '../../images/userimage.svg'
import personimage from '../../images/personimage.svg'
import addressimage from '../../images/addressimage.svg'
import dateimage from '../../images/dateimage.svg'
import faceimage from '../../images/faceimage.svg'
import { GoogleLogin } from '@react-oauth/google';
import jwt from 'jsonwebtoken'

export default function Register() {
  const [file, setFile] = useState({})
  const [isValidatedUsername, setIsValidatedUsername] = useState(false)
  const [isValidatedEmail, setIsValidatedEmail] = useState(false)
  const [isValidatedPassword, setIsValidatedPassword] = useState(false)
  const [isValidatedPasswordConfirm, setIsValidatedPasswordConfirm] = useState(false)
  const [isValidatedName, setIsValidatedName] = useState(false)
  const [isValidatedDate, setIsValidatedDate] = useState(false)
  const [isValidatedAddress, setIsValidatedAddress] = useState(false)
  const [isValidatedUsertype, setIsValidatedUsertype] = useState(false)
  const [isValidatedPicture, setIsValidatedPicture] = useState(false)
  const [isValidatedSurname, setIsValidatedSurname] = useState(false)
  const [profilePicture, setProfilePicture] = useState(noimage)
  const [isGoogleRegistration, setIsGoogleRegistration] = useState(false)
  const [defaultEmail, setdefaultEmail] = useState("")
  const [defaultName, setdefaultName] = useState("")
  const [defaultSurname, setdefaultSurname] = useState("")
  const [selectedUserTypeDefault, setselectedUserTypeDefault] = useState("")
  const [googleRegisterResponse, setGoogleRegiterResponse] = useState("")
  const nav = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault();

    setIsValidatedAddress(false)
    setIsValidatedDate(false)
    setIsValidatedEmail(false)
    setIsValidatedName(false)
    setIsValidatedPassword(false)
    setIsValidatedPasswordConfirm(false)
    setIsValidatedPicture(false)
    setIsValidatedUsername(false)
    setIsValidatedUsertype(false)
    setIsValidatedSurname(false)

    const usrname = event.target.registerusername.value;
    const password = event.target.registerpassword.value;
    const passwordconfirm = event.target.registerpasswordconfirm.value;
    const email = event.target.registeremail.value;
    const name = event.target.registername.value;
    const surname = event.target.registersurname.value;
    const date = event.target.registerdate.value;
    const address = event.target.registeraddress.value;
    const usertype = event.target.registerusertype.value;
    const haspicture = !!file.name;

    if (usrname.trim() === "") {
      setIsValidatedUsername(true)
      event.target.registerusername.focus()
      toast.warning("Please enter your username")
    }
    else if (password.trim() === "" && !isGoogleRegistration) {
      setIsValidatedPassword(true)
      event.target.registerpassword.focus()
      toast.warning("Plase enter your password")
    }
    else if (passwordconfirm.trim() === "" && !isGoogleRegistration) {
      setIsValidatedPasswordConfirm(true)
      event.target.registerpasswordconfirm.focus()
      toast.warning("Please confirm your password")
    }
    else if (email.trim() === "") {
      setIsValidatedEmail(true)
      event.target.registeremail.focus()
      toast.warning("Please enter your email")
    }
    else if (name.trim() === "") {
      setIsValidatedName(true)
      event.target.registername.focus()
      toast.warning("Plase enter your name")
    }
    else if (surname.trim() === "") {
      setIsValidatedSurname(true)
      event.target.registersurname.focus()
      toast.warning("Please enter your surname")
    }
    else if (date.trim() === "") {
      setIsValidatedDate(true)
      event.target.registerdate.focus()
      toast.warning("Plase enter your birthday")
    }
    else if (address.trim() === "") {
      setIsValidatedAddress(true)
      event.target.registeraddress.focus()
      toast.warning("Please enter your address")
    }
    else if (usertype.trim() === "") {
      setIsValidatedUsertype(true)
      event.target.registerusertype.focus()
      toast.warning("Please choose your usertype")
    }
    else if (password !== passwordconfirm && !isGoogleRegistration) {
      setIsValidatedPasswordConfirm(true)
      event.target.registerpasswordconfirm.focus()
      toast.warning("Passwords does not match")
    }
    else if (!haspicture && !isGoogleRegistration) { 
      setIsValidatedPicture(true)
      event.target.registerpicture.focus()
      toast.warning("Please choose your picture")
    }
    else if (file.size > (1024 * 1024)) {
      setIsValidatedPicture(true)
      event.target.registerpicture.focus()
      toast.warning("Please choose picture that is less than 1MB")
    }
    else {
      var year = parseInt(date.substr(0, 4))
      var month = parseInt(date.substr(4, 2));
      var day = parseInt(date.substr(6, 2));
      var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const now = new Date()

      if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
        daysInMonth[1] = 29;
      }
      if (day > daysInMonth[month - 1] || year < 1900 || year > now.getFullYear()) {
        setIsValidatedDate(true)
        toast.warning("Entered date is not valid")
        event.target.registerdate.focus()
      }
      else if(now.getFullYear()-year < 18){
          setIsValidatedDate(true)
          toast.warning("Entered date is not valid. You have to be 18+ years old.")
          event.target.registerdate.focus() 
      }
      else {
        const formData = new FormData()
        formData.append("Username", usrname);
        formData.append("Email", email);
        formData.append("Name", name);
        formData.append("Surname", surname);
        formData.append("DateOfBirth", date);
        formData.append("Address", address);
        formData.append("UserType", usertype);
        formData.append("PictureFromForm", file);
        if(isGoogleRegistration){
          formData.append("Password", "");
          formData.append("GoogleImageURL",profilePicture)
          formData.append("Token", googleRegisterResponse);
          googleregisteruser(formData, nav);
        }
        else{
          formData.append("Password",password)
          registeruser(formData, nav);
        }
      }
    }
  }
  const registeruser = async (data, nav) => {
    const RegisterUserDto = await RegisterService(data, nav);
  }

  const googleregisteruser = async (data, nav) => {
    const RegisterUserDto = await GoogleRegisterService(data, nav);
  }

  const handleInputChange = (event) => {
    if (event.target.files[0]) {
      if ((event.target.files[0]).size <= (1024 * 1024)) {
        if ((event.target.files[0]).type === "image/jpeg" || (event.target.files[0]).type === "image/png") {
          setFile(event.target.files[0])
          const reader = new FileReader()
          reader.onload = () => {
            setProfilePicture(reader.result)
          }
          reader.readAsDataURL(event.target.files[0])
        }
        else {
          toast.warning("Please choose a JPG or PNG file.")
        }
      }
      else
        toast.warning("Please choose picture that is less than 1MB")
    }
  };

  const successGoogleRegister = (response) => {
    const decodedToken = jwt.decode(response.credential)
    setGoogleRegiterResponse(response.credential)
    setIsGoogleRegistration(true)
    setdefaultEmail(decodedToken.email)
    setdefaultName(decodedToken.given_name)
    setdefaultSurname(decodedToken.family_name)
    setselectedUserTypeDefault("kupac")
    setProfilePicture(decodedToken.picture)
  }


  const errorGoogleRegister = (response) => {
    toast.error(response)
  }

  const handleSelectChange = (event) => {
    setselectedUserTypeDefault(event.target.value);
  }

  return (
    <form className="form_container_register" onSubmit={handleSubmit}>
      <div className="logo_container_register"><img src={reactimage} alt="no file" height={90} width={90} /></div>
      <div className="title_container_register">
        <p className="title_register">Register your account</p>
        <span className="subtitle_register">Get started with our app, just create an account and enjoy the experience.</span>
      </div>
      <br />

      <div className='input_row_register'>
        <div className="input_container_register">
          <label className="input_label_register">Username</label>
          <img src={userimage} alt="" className='icon_register' />
          <input placeholder="Username" name="registerusername" type="text" className={isValidatedUsername ? "input_field_wrong_register" : "input_field_register"} />
        </div>
        <div className="input_container_register">
          <label className="input_label_register" >Email</label>
          <img src={inputEmailIcon} alt="" className='icon_register' />
          <input placeholder="name@mail.com" name="registeremail" disabled={isGoogleRegistration} defaultValue={defaultEmail} type="email" className={isValidatedEmail ? "input_field_wrong_register" : "input_field_register"} />
        </div>
      </div>

      <div className='input_row_register'>
        <div className="input_container_register">
          <label className="input_label_register">Password</label>
          <img src={inputPasswordicon} alt="" className='icon_register' />
          <input placeholder="Password" name="registerpassword" type="password" disabled={isGoogleRegistration} className={isValidatedPassword ? "input_field_wrong_register" : "input_field_register"} />
        </div>
        <div className="input_container_register">
          <label className="input_label_register">Confirm password</label>
          <img src={inputPasswordicon} alt="" className='icon_register' />
          <input placeholder="Confirm password" name="registerpasswordconfirm" disabled={isGoogleRegistration} type="password" className={isValidatedPasswordConfirm ? "input_field_wrong_register" : "input_field_register"} />
        </div>
      </div>

      <div className='input_row_register'>
        <div className="input_container_register">
          <label className="input_label_register">Name</label>
          <img src={faceimage} alt="" className='icon_register' />
          <input placeholder="Name" name="registername" type="text" disabled={isGoogleRegistration} defaultValue={defaultName} className={isValidatedName ? "input_field_wrong_register" : "input_field_register"} />
        </div>
        <div className="input_container_register">
          <label className="input_label_register">Surname</label>
          <img src={faceimage} alt="" className='icon_register' />
          <input placeholder="Surname" name="registersurname" type="text" disabled={isGoogleRegistration} defaultValue={defaultSurname} className={isValidatedSurname ? "input_field_wrong_register" : "input_field_register"} />
        </div>
        <div className="input_container_register">
          <label className="input_label_register">Birthday</label>
          <img src={dateimage} alt="" className='icon_register' />
          <input name="registerdate" type="date" className={isValidatedDate ? "input_field_wrong_register" : "input_field_register"} />
        </div>
      </div>

      <div className='lastrow_container'>
        <div className='input_lastrowpt1_register'>

          <div className="input_container_register">
            <label className="input_label_register">Address</label>
            <img src={addressimage} alt="" className='icon_register' />
            <input placeholder="Address" name="registeraddress" type="text" className={isValidatedAddress ? "input_field_wrong_register" : "input_field_register"} />
          </div>

          <div className="input_container_register" style={{ paddingTop: "2%" }}>
            <label className="input_label_register">You are.. </label>
            <img src={personimage} alt="" className='icon_register' />
            <select
              className={isValidatedUsertype ? "input_field_wrong_register" : "input_field_register"}
              name='registerusertype' value={selectedUserTypeDefault} disabled={isGoogleRegistration} onChange={handleSelectChange}>
              <option value='' disabled>Choose</option>
              <option value='kupac'>Buyer</option>
              <option value='prodavac'>Seller</option>
            </select>
          </div>
        </div>

        <div className='input_lastrowpt2_register'>
          <label className="input_label_register">Profile picture</label>
          <div className={isValidatedPicture ? "input_container_register_picture_wrong" : "input_container_register_picture"} >

            <img src={profilePicture} alt="" width={80} height={80} />
            <div className='pictureoption'>
              <span className='spannote'>Accepted file types .jpg .png. Less than 1MB</span>
              <label className='custom_button_picture_upload' >
                Upload
                <input name="registerpicture" type="file" disabled={isGoogleRegistration} onChange={handleInputChange} accept='.png, .jpg' />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className='input_row_register' style={{ paddingTop: "1%" }}>
        <button type="submit" disabled={isGoogleRegistration} className="sign-in_btn_register">Sign Up</button>

        <div className="separator_register">
          <hr className="line_register" />
          <span>Or</span>
          <hr className="line_register" />
        </div>
        {!isGoogleRegistration && <GoogleLogin
          onSuccess={successGoogleRegister}
          onFailure={errorGoogleRegister}
          /> }
          {isGoogleRegistration && 
        <button type="submit" className="sign-in_btn_register">Complete sign up</button>
         }
      </div>
      <p className="note_register">Already registered? {" "}
        <a href="/login">Sign In</a></p>
    </form>
  )
}
