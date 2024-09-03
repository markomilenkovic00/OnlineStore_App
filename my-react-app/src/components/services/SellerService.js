import axios from 'axios';
import { toast } from "react-toastify";
import ProductDto from '../../models/ProductDto';
import OrderDto from '../../models/OrderDto';

export const GetProductsService=async(id)=>{
      return await axios.get(`${process.env.REACT_APP_API_URL}/api/seller/getproducts/${id}`, {
          headers:{           
              "Authorization" : `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`
          }
      }).then(function (response) { 
          const products = (response.data).map(dto => new ProductDto(dto.id, dto.name, dto.price, dto.quantity, dto.picture, dto.description, dto.userId, dto.seller, dto.orderedQuantity))
          return products;
        })
        .catch(function (error) { 
          return error;
        });
  }

export const AddProductService=async(data)=>{
    return await axios.post(`${process.env.REACT_APP_API_URL}/api/seller/addproduct`, data, {
      headers:{
          'Content-Type' : 'multipart/form-data',
          "Authorization" : `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`
      }
  }).then(function (response) {
      toast.success("Product sucessfully added.") 
      const addedProduct = new ProductDto((response.data).id, (response.data).name, (response.data).price, (response.data).quantity, (response.data).picture, (response.data).description, (response.data).userId, (response.data).seller, (response.data).orderedQuantity)
      return addedProduct;
    })
    .catch(function (error) {
      if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)              
      return false;
    });
    
  }

  export const DeleteProductService=async(id)=>{
    return await axios.delete(`${process.env.REACT_APP_API_URL}/api/seller/deleteproduct/${id}`, {
        headers:{           
            "Authorization" : `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`
        }
    }).then(function (response) { 
        toast.success("Product sucessfully deleted.") 
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

export const UpdateProductService=async(data)=>{
    return await axios.put(`${process.env.REACT_APP_API_URL}/api/seller/updateproduct`,data, {
        headers:{           
            "Authorization" : `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`,
            'Content-Type' : 'multipart/form-data'
        }
    }).then(function (response) { 
        toast.success("Product sucessfully updated") 
        const updatedProduct = new ProductDto((response.data).id, (response.data).name, (response.data).price, (response.data).quantity, (response.data).picture, (response.data).description, (response.data).userId, (response.data).seller, (response.data).orderedQuantity)
        return updatedProduct;
      })
      .catch(function (error) { 
        if(error.response.data)
          toast.error(error.response.data)   
        else
          toast.error(error)
        return false;
      });
}

export const GetNewOrdersService=async(id)=>{
  return await axios.get(`${process.env.REACT_APP_API_URL}/api/seller/getneworders/${id}`, {
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

export const GetOrdersHistoryService=async(id)=>{
  return await axios.get(`${process.env.REACT_APP_API_URL}/api/seller/getordershistory/${id}`, {
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

