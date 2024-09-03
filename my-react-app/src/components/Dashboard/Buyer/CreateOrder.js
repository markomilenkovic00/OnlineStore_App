import { useEffect, useState } from "react";
import { CreateOrderService } from "../../services/BuyerService";
import { toast } from 'react-toastify'
import './CreateOrder.css'
import CommentImage from '../../../images/commentimage.svg'
import AddressImage from '../../../images/addressimage.svg'

export default function CreateOrder(props) {

    const [isValidatedComment, setIsValidatedComment] = useState(false)
    const [isValidatedAddress, setIsValidatedAddress] = useState(false)

    const calculateTotalProductPrice = () => {
        if ((props.data).props.data.length !== 0) {
            var totalproductprice = 0;
            (props.data).props.data.map((product) => {
                totalproductprice += (product.price * product.OrderedQuantity);
            })
            return totalproductprice;
        }
        else {
            return 0;
        }
    }

    const calculateTotalDeliveryPrice = () => {
        var totaldeliveryprice = 0;
        const uniqueSellers = new Set((props.data).props.data.map(product => product.userId))
        totaldeliveryprice = uniqueSellers.size * 300;
        return totaldeliveryprice;
    }


    const handleSubmit = (event) => {
        event.preventDefault();

        setIsValidatedAddress(false)
        setIsValidatedComment(false)

        if ((props.data).props.data.length === 0)
            return toast.error("The cart is empty.")

        const komentar = event.target.komentar.value;
        const adresa = event.target.adresa.value;

        if (komentar.trim() === "") {
            setIsValidatedComment(true)
            toast.error("Please enter order comment!")
            event.target.komentar.focus()
        }
        else if (adresa.trim() === "") {
            event.target.adresa.focus()
            toast.error("Please enter order address!")
            setIsValidatedAddress(true)
        }
        else {
            const token = JSON.parse(localStorage.getItem("token"))
            const productListDictionary = (props.data).props.data.map((product) => ({ ProductId: Number(product.id), OrderedQuantity: product.OrderedQuantity }))
            const requestData = {
                productList: productListDictionary,
                comment: komentar,
                address: adresa,
                productsPrice: calculateTotalProductPrice(),
                deliveryPrice: calculateTotalDeliveryPrice(),
                totalPrice: calculateTotalDeliveryPrice() + calculateTotalProductPrice(),
                buyerId: token['userid']
            };
            CreateOrder(requestData)
        }
    }

    const CreateOrder = async (data) => {
        const resp = await CreateOrderService(data);
    }

    return (
        <div className="createorder-container">
            <span className="checkout-title">Checkout</span>
            {props.data}
            <div className="checkout-footer">
                <form onSubmit={handleSubmit} className="checkout-form">
                    <div className='input_row_checkout'>
                        <div className="input_container_checkout">
                            <label className="input_label_checkout">Comment</label>
                            <img src={CommentImage} alt="" className='icon_checkout' />
                            <input placeholder="Comment" name="komentar" type="text" className={isValidatedComment ? "input_field_wrong_checkout" : "input_field_checkout"} />
                        </div>
                    </div>
                    <div className='input_row_checkout'>
                        <div className="input_container_checkout">
                            <label className="input_label_checkout">Address</label>
                            <img src={AddressImage} alt="" className='icon_checkout' />
                            <input placeholder="Address" name="adresa" type="text" className={isValidatedAddress ? "input_field_wrong_checkout" : "input_field_checkout"} />
                        </div>
                    </div>
                    <button type="submit" className="checkout-button">Place order</button>
                </form>
                <div className="checkout-price">
                    <span>Total: {calculateTotalProductPrice()}rsd </span>
                    <span>Delivery: {calculateTotalDeliveryPrice()}rsd</span>
                    <span><i><b>Grand total: {calculateTotalProductPrice() + calculateTotalDeliveryPrice()}rsd</b></i></span>
                </div>
            </div>
        </div>
    );
}