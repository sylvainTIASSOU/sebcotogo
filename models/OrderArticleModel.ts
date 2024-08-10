export class OrderArticleModel {
    quantity: number;
    price: number;
    productId: number;
    orderId: number;
    id?: number;

    constructor(
        quantity: number,
        price: number,
        productId: number,
        orderId: number,
        id?: number,
    ) {
        this.quantity = quantity;
        this.price = price;
        this.productId = productId;
        this.orderId = orderId;
    }
}