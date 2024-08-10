export class StockModel {
    providerId: number;
    id?:number;
    isVisible?: boolean;
    isActived?: boolean;

    constructor(
        providerId: number,
        id?:number,
        isVisible?: boolean,
        isActived?: boolean
    ) {
        this.providerId = providerId;
        this.id = id;
        this.isVisible = isVisible;
        this.isActived = isActived;
    }
}