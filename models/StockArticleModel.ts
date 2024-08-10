export class StockArticleModel {
    quantity: number;
    stockPrice: number;
    productId: number;
    stockId: number;
    id?: number;

    constructor(
        quantity: number,
        stockPrice: number,
        productId: number,
        stockId: number,
        id?: number,
    ) {
        this.quantity = quantity;
        this.stockPrice = stockPrice;
        this.productId = productId;
        this.stockId = stockId;
        this.id = id;
    }

}