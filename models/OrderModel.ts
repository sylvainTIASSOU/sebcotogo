export class OrderModel {
    totalPrice: number;
    status: string;
    payement: string;
    amount: number;
    deliveryId: number;
    id?: number;
    isVisible?: boolean;
    isActived?: boolean;

    constructor(
        totalPrice: number,
        status: string,
        payement: string,
        amount: number,
        deliveryId: number,
        id?: number,
        isVisible?: boolean,
        isActived?: boolean
    ) {
        this.totalPrice = totalPrice;
        this.status = status;
        this.payement = payement;
        this.amount = amount;
        this.deliveryId = deliveryId;
        this.id = id;
        this.isActived = isActived;
        this.isVisible = isVisible;
    }


}
 