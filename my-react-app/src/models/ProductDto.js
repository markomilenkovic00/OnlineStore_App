import UserInfoDto from "./UserInfoDto";

class ProductDto {
    constructor(id, name, price, quantity, picture, description, userId, seller, orderedQuantity) {
      this.id = id || 0;
      this.name = name || "";
      this.price = price || 0.0;
      this.quantity = quantity || 0;
      this.picture = picture || null;
      this.description = description || "";
      this.userId = userId || "";
      this.seller = seller===null ? null : new UserInfoDto(seller.username, seller.email, seller.name, seller.surname, seller.address, seller.picture);
      this.orderedQuantity = orderedQuantity || 0;
    }
  }
  
  
export default ProductDto;
  