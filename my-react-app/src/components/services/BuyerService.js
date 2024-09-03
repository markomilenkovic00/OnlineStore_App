import axios from 'axios';
import { toast } from "react-toastify";
import ProductDto from '../../models/ProductDto'
import OrderDto from '../../models/OrderDto'

export const GetProductsService = async () => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/api/buyer/getproducts`, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`
    }
  }).then(function (response) {
    const products = (response.data).map(dto => new ProductDto(dto.id, dto.name, dto.price, dto.quantity, dto.picture, dto.description, dto.userId, dto.seller, dto.orderedQuantity))
    return products;
  })
    .catch(function (error) {
      return error;
    });
}

export const CreateOrderService = async (data) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/buyer/createorder`, data, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`
    }
  }).then(function (response) {
    const createdOrder = new OrderDto((response.data).id, (response.data).productList, (response.data).comment, (response.data).address, (response.data).productsPrice, (response.data).deliveryPrice, (response.data).totalPrice, (response.data).buyerId, (response.data).buyer, (response.data).orderPlacedOn, (response.data).deliveryTime, (response.data).deliveryDateTime, (response.data).canceled);
    toast.success("Your order will be delivered on: " + formatDateTime(createdOrder.deliveryDateTime))
    return createdOrder;
  })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
      return error;
    });
}

export const GetMyOrdersService = async (userId) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/api/buyer/getmyorders/${userId}`, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`
    }
  }).then(function (response) {
    const orders = (response.data).map(dto => new OrderDto(dto.id, dto.productList, dto.comment, dto.address, dto.productsPrice, dto.deliveryPrice, dto.totalPrice, dto.buyerId, dto.buyer, dto.orderPlacedOn, dto.deliveryTime, dto.deliveryDateTime, dto.canceled))
    return orders;
  })
    .catch(function (error) {
      return error;
    });
}

export const doCancelOrderService = async (orderid, buyerid) => {
  return await axios.put(`${process.env.REACT_APP_API_URL}/api/buyer/cancelorder/${orderid}/${buyerid}`, {}, {
    headers: {
      "Authorization": `Bearer ${JSON.parse(localStorage.getItem('encodedtoken'))}`
    }
  }).then(function (response) {
    toast.success("Order successfully canceled.")
    const canceledOrder = new OrderDto((response.data).id, (response.data).productList, (response.data).comment, (response.data).address, (response.data).productsPrice, (response.data).deliveryPrice, (response.data).totalPrice, (response.data).buyerId, (response.data).buyer, (response.data).orderPlacedOn, (response.data).deliveryTime);
    return canceledOrder;
  })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
      return error;
    });
}

const formatDateTime = (dateTime) => {
  const datetime = new Date(dateTime);
  const day = datetime.getDate();
  const month = datetime.toLocaleString("default", { month: "long" });
  const year = datetime.getFullYear();
  const hours = datetime.getHours();
  const minutes = datetime.getMinutes();
  const seconds = datetime.getSeconds();
  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
}