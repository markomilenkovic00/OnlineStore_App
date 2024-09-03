import {useState} from 'react'
import './Cart.css'

export default function Cart(props){
    const [toggleButton, settoggleButton] = useState(false)

    const handleRemoveItem= (itemId) => {
      props.removeFromCart(itemId);
    }

    const handleCartQuantityChange = (value, productid) => {
      props.handleQuantityChangeCart(productid, value)
    }

    const toggleChangeQuantity = (productid) => {
      if(!toggleButton){
        settoggleButton(!toggleButton)
      }
      else{
        props.changeExistingCartItemQuantity(productid)
        settoggleButton(false)
      }
    }

  return (
    <div className='ordercarts-container'>
      {props.data.length===0 && <div className='cart-title'>Cart is empty</div>}
      {props.data.map(product => (
        <div className='cart-container' key={product.id}>
          <div className='cart-picture'>
            <img height={120} width={120} src={`data:image/png;base64,${product.picture}`} alt="" />
          </div>
          <div className='cart-data'>
            <span className='cart-title'>{product.name}</span>
            <span className='cart-description'>{product.description}</span>
          </div>
          <div className="vertical-line-cart"></div>
          <div className='cart-price'>
            <span>Price : {product.price}rsd</span>
            <span>Quantity : {product.OrderedQuantity}</span>
            <span>Total : {product.price * product.OrderedQuantity}rsd</span>
          </div>
          <div className="vertical-line-cart"></div>
          <div className='cart-options'>
            <button onClick={() => toggleChangeQuantity(product.id)}>{toggleButton ? "Confirm":"Change quantity"}</button>
            {toggleButton && <input type="number" onChange={(event) => handleCartQuantityChange(event.target.value, product.id)} />}
            <button onClick={() => handleRemoveItem(product.id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}