import { useState, useEffect } from 'react'
import { DeleteProductService, GetProductsService } from '../../services/SellerService';
import ProductForm from './ProductForm'
import './AddProduct.css'

export default function AddProduct() {
  const [productData, setproductData] = useState([])
  const [showForm, setshowForm] = useState(false)
  const [formData, setFormData] = useState({});
  const [addOredit, setaddOredit] = useState(0)

  const getproductdata = async (id) => {
    const resp = await GetProductsService(id);
    setproductData(resp)
  }

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"))
    getproductdata(token['userid'])
  }, [])

  const deleteproduct = async (id) => {
    const resp = await DeleteProductService(id);
    if (resp === true) {
      setproductData(productData.filter(item => item.id !== id));
    }
  }

  const handleEditProduct = (productid) => {
    const desiredObject = productData.find(obj => obj.id === productid);
    setaddOredit(2)
    setshowForm(true)
    setFormData(desiredObject)
  }

  const handleDeleteProduct = (productid) => {
    deleteproduct(productid);
  }

  const handleAddProduct = () => {
    setaddOredit(1)
    setshowForm(!showForm)
    setFormData({
      description: "",
      id: "",
      name: "",
      picture: "",
      price: "",
      quantity: "",
      userId: ""
    })
  }

  const callbackAdd = (data) => {
    setproductData ([...productData, data])
  }

  const callbackEdit = (data) => {
      const productIndex = productData.findIndex(product => product.id === data.id)
      const updatedProducts = [...productData];
      updatedProducts[productIndex].name = data.name;
      updatedProducts[productIndex].price = data.price;
      updatedProducts[productIndex].quantity = data.quantity;
      updatedProducts[productIndex].description = data.description;
      updatedProducts[productIndex].picture = data.picture;
      setproductData(updatedProducts)
  }

  return (
    <div className='addproduct-maincontainer'>
      <div className='addproduct-header'>
        <button onClick={() => handleAddProduct()} className='addproduct-button'>Add Product</button>
        <hr style={{ width: "90%", margin: "0 auto" }}></hr>
        {showForm && <ProductForm data={formData} addOredit={addOredit} callbackAdd={callbackAdd} callbackEdit={callbackEdit}/>}
      </div>
      <div className="container_addproduct">
        {productData.map(product => (
          <div className="card_addproduct" key={product.id}>
            <div className="picture_addproduct">
              <img height={130} width={130} alt="" src={`data:image/png;base64,${product.picture}`} />
            </div>
            <div className="maintitleaddproduct">{product.name}</div>
            <div className="user-dataaddproduct">
              <div className="userdatarowaddproduct">{product.description}</div>
              <div className='userdatarowaddproduct'>
                <span className="addproduct-price"><i>Price:</i> &nbsp;{product.price}rsd</span>
                <span className='addproduct-quantity'><i>Quantity:</i> &nbsp; {product.quantity}</span>
              </div>
            </div>
            <div className="social_verificationaddproduct">
              <button className="buttonVerificationaddproduct" onClick={() => handleEditProduct(product.id)}>Edit</button>
              <button className="buttonVerificationaddproduct" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}