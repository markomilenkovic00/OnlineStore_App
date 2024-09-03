import { useEffect, useState } from "react";
import {GetMyOrdersService, doCancelOrderService} from '../../services/BuyerService'
import './OrderHistory.css'
import OrderDetails from '../../Dashboard/OrderDetails'

export default function OrderHistoryBuyer(){
    const [orderData, setordersData] = useState([])
    const [showOrder, setShowOrder] = useState(false)
    const [orderDetails, setOrderDetails] = useState({})
    const [showTable, setShowTable] = useState(true)

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"))
        GetMyOrders(token['userid'])
    },[])

    const GetMyOrders = async(id) => {
        const resp = await GetMyOrdersService(id);
        setordersData(resp)
    }

    const ShowOrderDetails = (id) => {
      const desiredObject = orderData.find(obj => obj.id === id);
      setOrderDetails(desiredObject)
      setShowOrder(true)
      setShowTable(false)
    }

    const HideOrderDetails = () => {
      setOrderDetails({})
      setShowOrder(false)
      setShowTable(true)
    }

    const showStatus = (cancelled, deliveryDateTime) => {
      if(cancelled === true){
          return "Cancelled"
      }
      else{
          if(new Date() > new Date(deliveryDateTime))
              return "Completed"
          else
              return "In progress"
      }
  }

    const CancelOrder = (orderid) => {
      const token = JSON.parse(localStorage.getItem("token"))
      doCancelOrder(orderid, token['userid']);
    }

    const doCancelOrder = async(orderid, buyerid) => {
      const resp = doCancelOrderService(orderid, buyerid)
      if(resp.id === orderid){
        setordersData(orderData.filter(item => item.id !== orderid));
      } 
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

    const canCanel = (orderPlacedOn, deliveryExpectedOn) => {
      if(new Date() > new Date(deliveryExpectedOn))
        return false;
      const timeDifference = Math.abs(new Date() - new Date(orderPlacedOn))
      if((timeDifference/(1000*60*60)) > 1)
        return true;
      else
        return false;
    }

    return(
      <>{showTable && <div className="wrapper_table">
        <div className="table_table">
          <div className="row_table header_table">
            <div className="cell_table">
              ID
            </div>
            <div className="cell_table">
              Buyer
            </div>
            <div className="cell_table">
              Address
            </div>
            <div className="cell_table">
              Comment
            </div>
            <div className="cell_table">
              Order Placed On
            </div>
            <div className="cell_table">
              Delivery On
            </div>
            <div className="cell_table">
              Price
            </div>
            <div className="cell_table">
              Status
            </div>
            <div className="cell_table">

            </div>
          </div>
          {orderData.map(order => (<div className="row_table" key={order.id}>
            <div className="cell_table" data-title="Order ID">
              {order.id}
            </div>
            <div className="cell_table" data-title="Buyer">
              {(order.buyer).name + " " + (order.buyer).surname}
            </div>
            <div className="cell_table" data-title="Address">
              {order.address}
            </div>
            <div className="cell_table" data-title="Comment">
              {order.comment}
            </div>
            <div className="cell_table" data-title="Order Placed On">
              {formatDateTime(order.orderPlacedOn)}
            </div>
            <div className="cell_table" data-title="Delivery On">
              {formatDateTime(order.deliveryDateTime)}
            </div>
            <div className="cell_table" data-title="Price">
              {order.totalPrice}
            </div>
            <div className="cell_table" data-title="Status">
              {showStatus(order.canceled, order.deliveryDateTime)}
            </div>
            <div className="cell_table" data-title="Details">
              <button className='button_orderhistory' onClick={() => ShowOrderDetails(order.id)}>Show details</button>
              {canCanel(order.orderPlacedOn, order.deliveryDateTime) && <button className="button_orderhistory" onClick={() => CancelOrder(order.id)}>Cancel</button>}
            </div>
          </div>))}
        </div>
      </div>}
        {showOrder && <div className='orderDetailsPage'>
          <OrderDetails orderDetails={orderDetails} HideOrderDetails={() => HideOrderDetails()} />
        </div>}
      </>
    );
}