import {useState, useEffect} from 'react'
import { AddProductService, UpdateProductService } from '../../services/SellerService';
import './ProductForm.css'
import ProductnameIcon from '../../../images/productnameicno.svg'
import ProductDescriptionIcon from '../../../images/descriptionicon.svg'
import ProductQuantityIcon from '../../../images/quantityicon.svg'
import ProductPriceIcon from '../../../images/priceicon.svg'
import noimage from '../../../images/noimage.svg'
import {toast} from 'react-toastify'

export default function ProductForm(props){
    
    const [file, setFile] = useState({})
    const [name, setname] = useState("")
    const [price, setprice] = useState("")
    const [quantity, setquantity] = useState("")
    const [description, setdescription] = useState("")
    const [picture, setpicture] = useState(noimage)
    const [productid, setproductid] = useState("")
    const [isValidatedName, setIsValidatedName] = useState(false)
    const [isValidatedPrice, setIsValidatedPrice] = useState(false)
    const [isValidatedDescription, setIsValidatedDescription] = useState(false)
    const [isValidatedQuantity, setIsValidatedQuantity] = useState(false)
    const [isValidatedPicture, setIsValidatedPicture] = useState(false)

    useEffect(() => {
        setname(props.data.name)
        setprice(props.data.price)
        setdescription(props.data.description)
        setquantity(props.data.quantity)
        setproductid(props.data.id)
        if(props.addOredit===2)
            setpicture(`data:image/png;base64,${props.data.picture}`)
    },[props.data])

    const handleSubmit = (event) => {
        event.preventDefault();

        setIsValidatedDescription(false)
        setIsValidatedName(false)
        setIsValidatedPicture(false)
        setIsValidatedPrice(false)
        setIsValidatedQuantity(false)

        const name = event.target.name.value;
        const price = event.target.price.value;
        const quantity = event.target.quantity.value;
        const description = event.target.description.value;
        const picture = !!file.name;

        if(name.trim() === ""){
            event.target.name.focus() 
            toast.warning("Plase enter product name!")
            setIsValidatedName(true)
        }
        else if(price.trim() === ""){
            event.target.price.focus()      
            toast.warning("Plase enter product price!")
            setIsValidatedPrice(true)
        }
        else if(quantity.trim() === ""){
            event.target.quantity.focus()      
            toast.warning("Plase enter product quantity!")
            setIsValidatedQuantity(true)
        }
        else if(description.trim() === ""){
            event.target.description.focus()      
            toast.warning("Plase enter product description!")
            setIsValidatedDescription(true)
        }
        else{
            if(props.addOredit===1){
                if(!picture){
                    toast.warning("Plase choose product picture!")
                    event.target.pictureinput.focus() 
                    setIsValidatedPicture(true)
                }
                else{
                    const formData = new FormData()
                    const token = JSON.parse(localStorage.getItem('token')); 
                    formData.append("Name", name);
                    formData.append("Price",price);
                    formData.append("Quantity",quantity)
                    formData.append("Description",description);
                    formData.append("PictureFromForm",file);
                    formData.append("UserId",token['userid']);                               
                    addproduct(formData);          
                }
            }
            else if(props.addOredit===2){
                const formData = new FormData()
                formData.append("Id",productid)
                formData.append("Name", name);
                formData.append("Price",price);
                formData.append("Quantity",quantity)
                formData.append("Description",description);
                formData.append("PictureFromForm",file);
                updateproduct(formData);
            }
        }     
    }

    const addproduct = async(data) =>{
        const resp = await AddProductService(data);
        if(resp !== false)
            props.callbackAdd(resp)    
    }

    const updateproduct = async(data) => {
        const resp = await UpdateProductService(data);
        if(resp !== false)
            props.callbackEdit(resp)
    }

    const handleInputChange = (event) => {
        if(event.target.files[0]){
            if((event.target.files[0]).size <= (1024*1024)){
              if((event.target.files[0]).type ==="image/jpeg" || (event.target.files[0]).type === "image/png"){
                const reader = new FileReader()
                reader.onload = () => {
                  setpicture(reader.result)
                }
                reader.readAsDataURL(event.target.files[0])
                setFile(event.target.files[0])
              }
              else{
                toast.warning("Please choose a JPG or PNG file.")
              }
            }
            else
              toast.warning("Please choose picture that is less than 1MB")
          }
      };

    return(
        <form className="form_container_productform" onSubmit={handleSubmit}>
            <div className="title_container_productform">
                <p className="title_productform">{props.addOredit === 1 && "Add product"}{props.addOredit === 2 && "Edit product"}</p>
            </div>
            <div className='input_row_productform'>
                <div className="input_container_productform">
                    <label className="input_label_productform">Product name</label>
                    <img src={ProductnameIcon} alt="" className='icon_productform' />
                    <input placeholder="Product name" defaultValue={name} name="name" type="text" className={isValidatedName ? "input_field_wrong_productform" : "input_field_productform"} />
                </div>
            </div>
            <div className='input_row_productform'>
                <div className="input_container_productform">
                    <label className="input_label_productform">Price</label>
                    <img src={ProductPriceIcon} alt="" className='icon_productform' />
                    <input placeholder="Price" name="price" defaultValue={price} type="number" className={isValidatedPrice ? "input_field_wrong_productform" : "input_field_productform"} />
                </div>
                <div className="input_container_productform">
                    <label className="input_label_productform">Quantity</label>
                    <img src={ProductQuantityIcon} alt="" className='icon_productform' />
                    <input placeholder="Quantity" name="quantity" type="number" defaultValue={quantity} className={isValidatedQuantity ? "input_field_wrong_productform" : "input_field_productform"} />
                </div>
            </div>
            <div className='input_row_productform'>
                <div className="input_container_productform">
                    <label className="input_label_productform">Description</label>
                    <img src={ProductDescriptionIcon} alt="" className='icon_productform' />
                    <input placeholder="Description" defaultValue={description} name="description" type="text" className={isValidatedDescription ? "input_field_wrong_productform" : "input_field_productform"} />
                </div>
            </div>
            <div className='lastrow_containerproductform'>
                <div className='input_lastrowpt2_productform'>
                    <label className="input_label_productform">Profile picture</label>
                    <div className={isValidatedPicture ? "input_container_productform_picture_wrong" : "input_container_productform_picture"}>
                        <img src={picture} alt="" width={80} height={80} />
                        <div className='pictureoptionproductform'>
                            <span className='spannoteproductform'>Accepted file types .jpg .png. Less than 1MB</span>
                            <label className='custom_button_picture_uploadproductform' >
                                Upload
                                <input name="pictureinput" type="file" onChange={handleInputChange} accept='.png, .jpg' />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div className='input_row_productform' style={{ paddingTop: "2%" }}>
                <button type="submit" className="sign-in_btn_productform">{props.addOredit === 1 && "Add product"}{props.addOredit === 2 && "Edit product"}</button>
            </div>
        </form>
    );
}