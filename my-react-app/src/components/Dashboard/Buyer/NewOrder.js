import { useState, useEffect } from 'react';
import { GetProductsService } from '../../services/BuyerService';
import Cart from './Cart'
import CreateOrder from './CreateOrder';
import { toast } from 'react-toastify'
import './NewOrder.css'
import { ReactComponent as Personimage } from '../../../images/personimage.svg'
import { ReactComponent as AddressImage } from '../../../images/addressimage.svg'
import { ReactComponent as EmailImage } from '../../../images/emailsvg.svg'

export default function NewOrder() {
  const [productData, setproductData] = useState([])
  const [cart, setcartData] = useState([])
  const [quantityInputs, setQuantityInputs] = useState([])
  const [toggleCart, setshowCart] = useState(false)
  const [toggleCreateOrder, settoggleCreateOrder] = useState(false)
  const [quantityInputsCart, setquantityInputsCart] = useState([])
  const [toggleSellerInfoCards, settoggleSellerInfoCards] = useState([])

  const GetProducts = async () => {
    const resp = await GetProductsService();
    setproductData(resp)
  }

  useEffect(() => {
    GetProducts();
  }, [])

  const AddToCart = (productid) => {
    var OrderedQuantity = 1;
    const index = quantityInputs.findIndex(product => product.id === productid)
    if (quantityInputs[index])
      OrderedQuantity = quantityInputs[index].value
    const indexinCart = cart.findIndex(product => product.id === productid)
    var OrderedQuantityPlusInCart = OrderedQuantity;
    if (cart[indexinCart]) {
      OrderedQuantityPlusInCart += +cart[indexinCart].OrderedQuantity;
    }
    if (isNaN(OrderedQuantity)) {
      toast.error("Quantity input must be number.")
    }
    else if (OrderedQuantity < 1) {
      toast.error("Invalid quantity. Number must be greater than zero.");
    }
    else if (OrderedQuantityPlusInCart > productData.find(obj => obj.id === productid).quantity) {
      const product = productData.find(obj => obj.id === productid).quantity
      const ordq = cart[indexinCart] ? cart[indexinCart].OrderedQuantity : 0
      const leftInStock = product - ordq
      toast.error("You tried to add " + OrderedQuantity + "x" + productData.find(obj => obj.id === productid).name + ", but there are only " + leftInStock + " left in stock.")
    }
    else {
      if (cart[indexinCart]) {
        const updatedProducts = [...cart]
        updatedProducts[indexinCart].OrderedQuantity += +OrderedQuantity;
        setcartData(updatedProducts)
        toast.success("Sucessfully added " + OrderedQuantity + "x" + updatedProducts[indexinCart].name + " to cart. ")
      }
      else {
        const desiredObject = productData.find(obj => obj.id === productid);
        if (desiredObject) {
          setcartData((prevCartItems) => [...prevCartItems, { ...desiredObject, OrderedQuantity }])
          toast.success("Sucessfully added " + OrderedQuantity + "x" + desiredObject.name + " to cart.")
        }
      }
    }
  }

  const isProductInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  const handleQuantityChange = (productId, value) => {
    const index = quantityInputs.findIndex(product => product.id === productId)
    if (index !== -1) {
      const updatedProducts = [...quantityInputs];
      updatedProducts[index].value = parseInt(value);
      setQuantityInputs(updatedProducts)
    }
    else {
      const newProduct = { id: productId, value: parseInt(value) };
      const updatedProducts = [...quantityInputs, newProduct];
      setQuantityInputs(updatedProducts)
    }
  };

  const showCartfunction = () => {
    setshowCart(!toggleCart)
    settoggleCreateOrder(false)
  }

  const removeFromCart = (itemId) => {
    setcartData(cart.filter(item => item.id !== itemId));
    toast.success("Item successfully removed from cart.")
  };

  const showCreateOrder = () => {
    settoggleCreateOrder(!toggleCreateOrder)
    setshowCart(false)
  }

  const changeExistingCartItemQuantity = (productid) => {
    const index = quantityInputsCart.findIndex(product => product.id === productid)
    var OrderedQuantity = null;
    if (quantityInputsCart[index])
      OrderedQuantity = quantityInputsCart[index].value
    
    if ((OrderedQuantity > cart.find(obj => obj.id === productid).quantity) || (OrderedQuantity < 1) || isNaN(OrderedQuantity) || OrderedQuantity===null) {
      toast.error("Invalid quantity.");
    }
    else{
      const cartindex = cart.findIndex(product => product.id === productid)
      const updatedProducts = [...cart];
      updatedProducts[cartindex].OrderedQuantity = OrderedQuantity;
      setcartData(updatedProducts)
    }
  }

  const handleQuantityChangeCart = (productId, value) => {
    const index = quantityInputsCart.findIndex(product => product.id === productId)
    if (index !== -1) {
      const updatedProducts = [...quantityInputsCart];
      updatedProducts[index].value = parseInt(value);
      setquantityInputsCart(updatedProducts)
    }
    else {
      const newProduct = { id: productId, value: parseInt(value) };
      const updatedProducts = [...quantityInputsCart, newProduct];
      setquantityInputsCart(updatedProducts)
    }
  };

  const showSellerInfo = (productid) => {
    if (toggleSellerInfoCards.includes(productid)) {
      settoggleSellerInfoCards(toggleSellerInfoCards.filter(id => id !== productid));
    } else {
      settoggleSellerInfoCards([...toggleSellerInfoCards, productid]);
    }
  }

  return (
    <div>
      <div className='neworder-maincontainer'>
        <div className='neworder-header'>
          <button className='neworder-button' onClick={() => showCartfunction()}>{!toggleCart ? "Show cart" : "Hide cart"}</button>
          <button className='neworder-button' onClick={() => showCreateOrder()}>{!toggleCreateOrder ? "Place order" : "Hide"}</button>
        </div>
        <hr style={{ width: "90%", margin: "0 auto", marginTop: "1rem" }}></hr>
        {!toggleCart && !toggleCreateOrder && <div className="container_neworder">
          {productData.map(product => (
            <div className="card_neworder" key={product.id}>
              <div className="picture_neworder">
                <img height={130} width={130} src={`data:image/png;base64,${toggleSellerInfoCards.includes(product.id) ? (product.seller).picture : product.picture}`} />
              </div>
              <div className="maintitleneworder">{toggleSellerInfoCards.includes(product.id) ? (product.seller).name + " " + (product.seller).surname : product.name}</div>
              <div className="user-dataneworder">
                {toggleSellerInfoCards.includes(product.id) ?
                  <div className='seller-info-toggle'>
                    <div><Personimage className='verification-icon' fill="#fbc85c" /> {(product.seller).username}</div>
                    <div><EmailImage className='verification-icon' fill="#fbc85c" /> {(product.seller).email}</div>
                    <div><AddressImage className='verification-icon' fill="#fbc85c" /> {(product.seller).address}</div>
                  </div>
                  :
                  <div className="userdatarowneworder">{product.description}</div>}
                <div className='userdatarowneworder'>
                  <button className='button-showsellerinfo' onClick={() => showSellerInfo(product.id)}>{toggleSellerInfoCards.includes(product.id) ? "Back" :"Seller info"}</button>
                  {toggleSellerInfoCards.includes(product.id) ? "" : <span className="neworder-price"><i>Price:</i> &nbsp;{product.price}rsd</span>}
                </div>
              </div>{toggleSellerInfoCards.includes(product.id) ? "" :
              <div className="social_verificationneworder">
                <input type="number" className='buttonVerificationneworder' name={product.id} defaultValue={1} onChange={(event) => handleQuantityChange(product.id, event.target.value)} />
                <button className='buttonVerificationneworder' onClick={() => AddToCart(product.id)} >
                  {isProductInCart(product.id) ? 'Add' : 'Add to cart'}
                </button>
                {isProductInCart(product.id) && <button className='buttonVerificationneworder' onClick={() => removeFromCart(product.id)}>Remove</button>}
              </div>}
            </div>
          ))}
        </div>}
      </div>
      <div style={{maxWidth:"90%", margin:"0 auto"}}>{toggleCart && !toggleCreateOrder && <Cart data={cart} removeFromCart={removeFromCart} handleQuantityChangeCart={handleQuantityChangeCart} changeExistingCartItemQuantity={changeExistingCartItemQuantity} backgroundColor={"skyblue"} />}</div>
      {toggleCreateOrder && !toggleCart && <CreateOrder data={<Cart data={cart} removeFromCart={removeFromCart} handleQuantityChangeCart={handleQuantityChangeCart} changeExistingCartItemQuantity={changeExistingCartItemQuantity} backgroundColor={"lightcyan"} />} />}
    </div>
  );
}