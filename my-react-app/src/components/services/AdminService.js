import axios from 'axios';
import { toast } from "react-toastify";
import UserProfileDto from '../../models/UserProfileDto';
import OrderDto from '../../models/OrderDto'

export const GetSellers=async()=>{
    return await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getsellers`, {
        headers:{           
            "Authorization" : `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`
        }
    }).then(function (response) {  
        const userProfiles = (response.data).map(dto => new UserProfileDto(dto.id, dto.username, dto.password, dto.email, dto.name, dto.surname, dto.dateOfBirth, dto.address, dto.picture, dto.verify));
        return userProfiles;
      })
      .catch(function (error) { 
        if(error.response.data)
      toast.error(error.response.data)   
    else
      toast.error(error)
        return error;
      });
}

export const DoVerifySeller = async(id, verification)=>{
  return await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/${id}/${verification}`, {},{
    headers:{   
      "Authorization" : `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`
    }
}).then(function (response) {   
    if(response.data==="True"){
      toast.success("Profile sucessfully verified!")     
    }
    else{
      toast.success("Profile verification denied!")     
    }
    return response.data;
  })
  .catch(function (error) { 
    if(error.response.data)
      toast.error(error.response.data)   
    else
      toast.error(error)
    return error;
  });
}

export const GetOrdersService=async()=>{
  return await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/getordershistory`, {
      headers:{           
          "Authorization" : `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`
      }
  }).then(function (response) { 
      const orders = (response.data).map(dto => new OrderDto(dto.id, dto.productList, dto.comment, dto.address, dto.productsPrice, dto.deliveryPrice, dto.totalPrice, dto.buyerId, dto.buyer, dto.orderPlacedOn, dto.deliveryTime, dto.deliveryDateTime, dto.canceled))        
      return orders;
    })
    .catch(function (error) { 
      if(error.response.data)
      toast.error(error.response.data)   
    else
      toast.error(error)
      return error;
    });
}

