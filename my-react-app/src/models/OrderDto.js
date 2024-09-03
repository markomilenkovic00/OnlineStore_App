import ProductDto from "./ProductDto";
import UserInfoDto from './UserInfoDto'

class OrderDto {
    constructor(
        id, productList, comment, address, productsPrice, deliveryPrice, totalPrice, buyerId, buyer, orderPlacedOn, deliveryTime, deliveryDateTime, canceled) {
        this.id = id || 0;
        this.productList = productList===null ? [] : productList.map(dto => new ProductDto(dto.id, dto.name, dto.price, dto.quantity, dto.picture, dto.description, dto.userId, dto.seller, dto.orderedQuantity));
        this.comment = comment || "";
        this.address = address || "";
        this.productsPrice = productsPrice || 0.0;
        this.deliveryPrice = deliveryPrice || 0.0;
        this.totalPrice = totalPrice || 0.0;
        this.buyerId = buyerId || 0;
        this.buyer = new UserInfoDto(buyer.username, buyer.email, buyer.name, buyer.surname, buyer.address, buyer.picture)
        this.orderPlacedOn = orderPlacedOn || null;
        this.deliveryTime = deliveryTime || 0;
        this.deliveryDateTime = deliveryDateTime || null;
        this.canceled = canceled || false;
    }
}

export default OrderDto;