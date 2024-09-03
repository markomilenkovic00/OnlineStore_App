import { useState, React } from 'react'
import './OrderDetails.css'
import { ReactComponent as ExitIcon } from '../../images/CloseImage.svg'

export default function OrderDetails(props) {

    const [sellerInfoShow, setSellerInfoShow] = useState(false)
    const [sellerData, setSellerdata] = useState({})

    const handleBack = () => {
        props.HideOrderDetails();
    }

    const order = props.orderDetails;

    const showSellerInfo = (seller) => {
        setSellerInfoShow(!sellerInfoShow)
        setSellerdata(seller)
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

    const token = JSON.parse(localStorage.getItem('token'))
    const role = token['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

    return (
        <div className="orderdetails-container">
            <div className='orderheader-container'>
                <div className='buyerinfo'>
                    <div className='buyerinfo-title'>
                        Thanks for your order, {(order.buyer).name}!
                    </div>
                    <div className='buyerinfo-container'>
                        <div className='buyerinfo-data'>
                            <span className='buyerinfo-row'>{(order.buyer).name + " " + (order.buyer).surname}</span>
                            <span className='buyerinfo-row'>{(order.buyer).address}</span>
                            <span className='buyerinfo-row'>{(order.buyer).email}</span>
                            <span className='buyerinfo-row'>@{(order.buyer).username}</span>
                        </div>
                        <div className='buyerinfo-picture'>
                            <img height={90} width={90} src={`data:image/png;base64,${(order.buyer).picture}`} alt="" />
                        </div>
                    </div>
                </div>
                <div className='sellerinfo'>
                    <button className="exitButton" onClick={() => handleBack()}><ExitIcon className='ExitIcon' fill='#5f6770' /></button>
                    {sellerInfoShow && <div className='sellerinfo-container'>
                        <div className='sellerinfo-data'>
                            <span className='sellerinfo-row'>{sellerData.name + " " + sellerData.surname}</span>
                            <span className='sellerinfo-row'>{sellerData.address}</span>
                            <span className='sellerinfo-row'>{sellerData.email}</span>
                            <span className='sellerinfo-row'>@{sellerData.username}</span>
                        </div>
                        <div className='sellerinfo-picture'>
                            <img height={90} width={90} src={`data:image/png;base64,${sellerData.picture}`} alt="" />
                        </div>
                    </div>}
                </div>
            </div>
            <hr style={{ width: "90%", margin: "0 auto" }}></hr>
            <div className='orderproducts-container'>
                {(order.productList).map(product => (
                    <div className='product-container' key={product.id}>
                        <div className='product-picture'>
                            <img height={120} width={120} src={`data:image/png;base64,${product.picture}`} alt="" />
                        </div>
                        <div className='product-data'>
                            <span className='product-title'>{product.name}</span>
                            <span className='product-description'>{product.description}</span>
                            {role!=="prodavac" && <button onClick={() => showSellerInfo(product.seller)} className='sellerinfo-button'>Seller info</button>}
                        </div>
                        <div className="vertical-line"></div>
                        <div className='product-price'>
                            <span>Price : {product.price}rsd</span>
                            <span>Quantity : {product.orderedQuantity}</span>
                            <span>Total : {product.price * product.orderedQuantity}rsd</span>
                        </div>
                    </div>
                ))}
            </div>
            <hr style={{ width: "90%", margin: "0 auto", marginTop:"3%" }}></hr>
            <div className='order-footer'>
                <div className='order-details'>
                    <span><b>Address:</b> {order.address}</span>   
                    <span><b>Comment:</b> {order.comment}</span>
                    <span><b>Status:</b> {showStatus(order.cancelled, order.deliveryDateTime)}</span>
                    <span><b>Order placed on:</b> {formatDateTime(order.orderPlacedOn)}</span>   
                    <span><b>Delivery expected on:</b> {formatDateTime(order.deliveryDateTime)}</span>                 
                </div>
                <div className='order-price'>
                    <span>Total: {order.productsPrice}rsd</span>
                    <span>Delivery: {order.deliveryPrice}rsd</span>
                    <span><i><b>Grand total: {order.totalPrice}rsd</b></i></span>
                </div>
            </div>
        </div>
    );
}