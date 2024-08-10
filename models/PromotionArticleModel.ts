export  class PromotionArticleModel {
    newPrice: number;
    oldPrice: number
    productId: number;
    promotionId: number;
    id?: number;

    constructor(
        newPrice: number,
    oldPrice: number,
    productId: number,
    promotionId: number,
        id?: number
    ) {
        this.newPrice = newPrice;
        this.oldPrice = oldPrice;
        this.productId = productId;
        this.promotionId = promotionId;
        this.id = id;
    }
}