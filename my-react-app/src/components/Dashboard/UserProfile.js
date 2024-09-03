import './UserProfile.css'
import {useEffect, useState} from 'react';
import { GetUserProfileService, UpdateUserProfileService } from '../services/UserProfileService';
import inputEmailIcon from '../../images/emailsvg.svg'
import inputPasswordicon from '../../images/passwordsvg.svg'
import {toast} from 'react-toastify'
import userimage from '../../images/userimage.svg'
import personimage from '../../images/personimage.svg'
import addressimage from '../../images/addressimage.svg'
import dateimage from '../../images/dateimage.svg'
import faceimage from '../../images/faceimage.svg'

export default function UserProfile(){
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [name, setname] = useState("")
    const [surname, setsurname] = useState("")
    const [address, setaddress] = useState("")
    const [date, setdate] = useState("")
    const [picture, setpicture] = useState("")
    const [email, setemail] = useState("")
    const [file, setFile] = useState({})
    const [isGoogle, setisGoogle] = useState(false)

    const [isValidatedUsername, setIsValidatedUsername] = useState(false)
    const [isValidatedEmail, setIsValidatedEmail] = useState(false)
    const [isValidatedNewPassword, setIsValidatedNewPassword] = useState(false)
    const [isValidatedNewPasswordConfirm, setIsValidatedNewPasswordConfirm] = useState(false)
    const [isValidatedName, setIsValidatedName] = useState(false)
    const [isValidatedDate, setIsValidatedDate] = useState(false)
    const [isValidatedAddress, setIsValidatedAddress] = useState(false)
    const [isValidatedCurrentPassword, setIsValidatedCurrentPassword] = useState(false)
    const [isValidatedSurname, setIsValidatedSurname] = useState(false)

    const getuserdata = async(data) =>{
        const resp = await GetUserProfileService(data);
        setusername(resp.username)
        setpassword(resp.password)
        setname(resp.name)
        setsurname(resp.surname)
        setaddress(resp.address)
        setemail(resp.email)
        setdate(resp.dateOfBirth.substring(0,10))
        setpicture(`data:image/png;base64,${resp.picture}`)
      if (resp.password === "")
        setisGoogle(true)
      
    }

    useEffect(()=>{
        const token = JSON.parse(localStorage.getItem('token'));
        if(token){        
            getuserdata(token['userid'])   
        } 
    },[])

    const handleSubmit = (event) => {
        event.preventDefault();

        setIsValidatedAddress(false)
        setIsValidatedDate(false)
        setIsValidatedEmail(false)
        setIsValidatedName(false)
        setIsValidatedNewPassword(false)
        setIsValidatedNewPasswordConfirm(false)
        setIsValidatedUsername(false)
        setIsValidatedCurrentPassword(false)
        setIsValidatedSurname(false)

        const usrname = event.target.usernameinput.value;
        const currentpassword = event.target.trenutnipassinput.value;
        const newpassword = event.target.novipassinput.value;
        const confirmnewpassword = event.target.opetnovipassinput.value;
        const email = event.target.emailinput.value;
        const name = event.target.nameinput.value;
        const surname = event.target.surnameinput.value;
        const date = event.target.dateinput.value;
        const address = event.target.addressinput.value;

        if(usrname.trim() === ""){
            setIsValidatedUsername(true)
            event.target.usernameinput.focus()   
            toast.warning("Please enter your username")
        }
        else if(newpassword.trim() !== "" && newpassword.trim() !== confirmnewpassword.trim()){
            event.target.opetnovipassinput.focus()
            setIsValidatedNewPasswordConfirm(true)
            toast.warning("Plase confirm your new password")
        }
         else if(confirmnewpassword.trim() !== "" && newpassword.trim() !== confirmnewpassword.trim()){
            event.target.novipassinput.focus()   
            toast.warning("Plase confirm your new password")
            setIsValidatedNewPassword(true)
         }
        else if(name.trim() === ""){
            setIsValidatedName(true)
            toast.warning("Plase enter your name")
            event.target.nameinput.focus()      
        }
        else if(surname.trim() === ""){
            setIsValidatedSurname(true)
            toast.warning("Please enter your surname")
            event.target.surnameinput.focus()      
        }
        else if(date.trim() === ""){
            setIsValidatedDate(true)
            toast.warning("Plase enter your birthday")
            event.target.dateinput.focus()      
        }
        else if(address.trim() === ""){
            setIsValidatedAddress(true)
            toast.warning("Please enter your address")
            event.target.addressinput.focus()      
        }
        else if(currentpassword.trim() === "" && !isGoogle){
            event.target.trenutnipassinput.focus() 
            setIsValidatedCurrentPassword(true)
            toast.warning("Please enter current password to procced.")
        }
        else{
            var year = parseInt(date.substr(0,4))
            var month = parseInt(date.substr(4, 2));
            var day = parseInt(date.substr(6, 2));
            var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            const now = new Date()

            if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
                daysInMonth[1] = 29;
            }
            if(day > daysInMonth[month-1] || year < 1900 || year > now.getFullYear()){
                setIsValidatedDate(true)
                toast.warning("Entered date is not valid")
                event.target.registerdate.focus() 
            }
            else if(now.getFullYear()-year < 18){
                setIsValidatedDate(true)
                toast.warning("Entered date is not valid. You have to be 18+ years old.")
                event.target.dateinput.focus() 
            }
            else{
                const formData = new FormData()
                const token = JSON.parse(localStorage.getItem('token'));
                formData.append("Id", token['userid'])    
                formData.append("Username", usrname);
                formData.append("Password",newpassword);
                formData.append("CurrentPassword",currentpassword)
                formData.append("Email",email);
                formData.append("Name",name);
                formData.append("Surname",surname);
                formData.append("DateOfBirth",date);
                formData.append("Address",address);            
                formData.append("PictureFromForm",file);                
                updateuser(formData);                                                               
            }   
        }  
    }

    const updateuser = async(data) =>{
        return await UpdateUserProfileService(data);      
    }
    
    const handleInputChange = (event) => {
        if(event.target.files[0]){
            if((event.target.files[0]).size <= (1024*1024)){
              if((event.target.files[0]).type ==="image/jpeg" || (event.target.files[0]).type === "image/png"){
                const reader = new FileReader()
                reader.onload = () => {
                  setpicture(reader.result)
                }
                reader.readAsDataURL(event.target.files[0])
                setFile(event.target.files[0])
              }
              else{
                toast.warning("Please choose a JPG or PNG file.")
              }
            }
            else
              toast.warning("Please choose picture that is less than 1MB")
          }
    };

    return(
        <form className="form_container_userprofile" onSubmit={handleSubmit}>
      <div className="title_container_register">
        <p className="title_userprofile">Account settings</p>
      </div>

      <div className='input_row_register'>
        <div className="input_container_register">
          <label className="input_label_register">Username</label>
          <img src={userimage} alt="" className='icon_register'/>
          <input placeholder="Username" defaultValue={username} name="usernameinput" type="text" className={isValidatedUsername ?  "input_field_wrong_register" : "input_field_register"}/>
        </div>
        <div className="input_container_register">
          <label className="input_label_register" >Email</label>
          <img src={inputEmailIcon} alt="" className='icon_register'/>
          <input placeholder="name@mail.com" defaultValue={email} name="emailinput" disabled={isGoogle} type="email" className={isValidatedEmail ?  "input_field_wrong_register" : "input_field_register"}/>
        </div>
      </div>

      <div className='input_row_register'>
        <div className="input_container_register">
          <label className="input_label_register">New Password  <span style={{fontSize:"smaller", fontStyle:"italic"}}>*optional</span></label>
          <img src={inputPasswordicon} alt="" className='icon_register'/>
          <input placeholder="New password" disabled={isGoogle} name="novipassinput" type="password" className={isValidatedNewPassword ?  "input_field_wrong_register" : "input_field_register"}/>
        </div>
        <div className="input_container_register">
          <label className="input_label_register">Confirm new password</label>
          <img src={inputPasswordicon} alt="" className='icon_register'/>
          <input placeholder="Confirm new password" disabled={isGoogle} name="opetnovipassinput" type="password" className={isValidatedNewPasswordConfirm ?  "input_field_wrong_register" : "input_field_register"}/>
        </div>
      </div>

      <div className='input_row_register'>
        <div className="input_container_register">
          <label className="input_label_register">Name</label>
          <img src={faceimage} alt="" className='icon_register'/>
          <input placeholder="Name" defaultValue={name} name="nameinput" type="text" className={isValidatedName ?  "input_field_wrong_register" : "input_field_register"}/>
        </div>
        <div className="input_container_register">
          <label className="input_label_register">Surname</label>
          <img src={faceimage} alt="" className='icon_register'/>
          <input placeholder="Surname" defaultValue={surname} name="surnameinput" type="text" className={isValidatedSurname ?  "input_field_wrong_register" : "input_field_register"}/>
        </div>
        <div className="input_container_register">
          <label className="input_label_register">Birthday</label>
          <img src={dateimage} alt="" className='icon_register'/>
          <input name="dateinput" defaultValue={date} type="date" className={isValidatedDate ?  "input_field_wrong_register" : "input_field_register"}/>
        </div>
      </div>

      <div className='lastrow_container'>
        <div className='input_lastrowpt1_register'>

          <div className="input_container_register">
            <label className="input_label_register">Address</label>
            <img src={addressimage} alt="" className='icon_register'/>
            <input placeholder="Address" name="addressinput" defaultValue={address} type="text" className={isValidatedAddress ?  "input_field_wrong_register" : "input_field_register"}/>
          </div>
          
          <div className="input_container_register" style={{paddingTop:"2%"}}>
              <label className="input_label_register">To save changes, enter current password:</label>
              <img src={personimage} alt="" className='icon_register'/>
              <input type="password" disabled={isGoogle} placeholder='Current password' name="trenutnipassinput" className={isValidatedCurrentPassword ? "input_field_wrong_register" : "input_field_register"}/>
            </div>
        </div>

        <div className='input_lastrowpt2_register'>
          <label className="input_label_register">Profile picture</label>
          <div className="input_container_register_picture">
            
            <img src={picture} alt="" width={80} height={80} />
            <div className='pictureoption'>
              <span className='spannote'>Accepted file types .jpg .png. Less than 1MB</span>
              <label className='custom_button_picture_upload' >
                Upload
                <input name="registerpicture" type="file" onChange={handleInputChange} accept='.png, .jpg' />
              </label>
            </div>
          </div>
        </div>
      </div>
        
      <div className='input_row_register' style={{paddingTop:"2%"}}>
        <button type="submit" className="sign-in_btn_register">Save changes</button>
        </div>
    </form>
    );
}
