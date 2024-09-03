import axios from 'axios';
import { toast } from "react-toastify";
import jwt from 'jsonwebtoken'
import RegisterUserDto from '../../models/RegisterUserDto';

export const LoginService=async(data, navigate)=>{
    return await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, data, {
        headers:{
            'Content-Type' : 'application/json'
        }
    }).then(function (response) {   
        const secretKey = process.env.REACT_APP_SECRET_KEY;   
        const issuer = process.env.REACT_APP_ISSUER; 
        try{  
          const decodedToken = jwt.verify(response.data, secretKey, {issuer:issuer});
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp && decodedToken.exp < currentTime) 
            {         
              throw new Error("Error: Expired token")
            } 
          else 
            {
              localStorage.setItem('token', JSON.stringify(decodedToken));
              localStorage.setItem('encodedtoken',JSON.stringify(response.data))
              localStorage.setItem('userverified', JSON.stringify(decodedToken.verify))
              localStorage.setItem("username",JSON.stringify(decodedToken.name))
              toast.success("Successfully logged in.")           
              navigate("../home")
            }   
        }
        catch(err){
          throw new Error('Invalid token')
        }    
        return response;
      })
      .catch(function (error) {
        if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)
        return error;
      });
}

export const RegisterService=async(data, navigate)=>{
  await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, data, {
    headers:{
        'Content-Type' : 'multipart/form-data'
    }
}).then(function (response) {
    toast.success("Successfully registered.") 
    navigate("../login")
    const registerUserDto = new RegisterUserDto((response.data).id, (response.data).username, (response.data).password, (response.data).email, (response.data).name, (response.data).surname, (response.data).dateOfBirth, (response.data).userType, (response.data).address, (response.data).pictureFromForm);
    return registerUserDto;
  })
  .catch(function (error) {
    if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)               
    return false;
  });
}

export const GoogleRegisterService=async(data, navigate)=>{
  await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/googleregister`, data, {
    headers:{
        'Content-Type' : 'multipart/form-data'
    }
}).then(function (response) {
    toast.success("Successfully registered.") 
    navigate("../login")
    const registerUserDto = new RegisterUserDto((response.data).id, (response.data).username, (response.data).password, (response.data).email, (response.data).name, (response.data).surname, (response.data).dateOfBirth, (response.data).userType, (response.data).address, (response.data).pictureFromForm);
    return registerUserDto;
  })
  .catch(function (error) {
    if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)               
    return false;
  });
}

export const GoogleLoginService=async(data, navigate)=>{
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/googlelogin`, data, {
      headers:{
          'Content-Type' : 'application/json'
      }
  }).then(function (response) {   
      const secretKey = process.env.REACT_APP_SECRET_KEY;   
      const issuer = process.env.REACT_APP_ISSUER; 
      try{       
        const decodedToken = jwt.verify(response.data, secretKey, {issuer:issuer});
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) 
          {         
            throw new Error("Error: Expired token")
          } 
        else 
          {
            localStorage.setItem('token', JSON.stringify(decodedToken));
            localStorage.setItem('encodedtoken',JSON.stringify(response.data))
            localStorage.setItem('userverified', JSON.stringify(decodedToken.verify))
            localStorage.setItem("username",JSON.stringify(decodedToken.name))
            toast.success("Successfully logged in.")           
            navigate("../home")
          }   
      }
      catch(err){
        throw new Error('Invalid token')
      }    
      return response;
    })
    .catch(function (error) {
      if(error.response.data)
        toast.error(error.response.data)   
      else
        toast.error(error)
      return error;
    });
}

