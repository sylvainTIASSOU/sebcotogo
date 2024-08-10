export class DeliveryModel {
    city: string;
    quarter: string;
    deliveryDate: string;
    deliveryHoures: string;

    indiqueName: string;
    indiqueNumber: number;
    userId: number;
    codePromo?: string;
    id?: number;
    longitude?: string;
    latitude?: string;
    isVisible?: boolean
    isActived?: boolean

    constructor(
        city: string,
        quarter: string,
        deliveryDate: string,
        deliveryHoures: string,
        indiqueName: string,
        indiqueNumber: number,
        userId: number,
        codePromo?: string,
        id?: number,
        longitude?: string,
        latitude?: string,
        isVisible?: boolean,
        isActived?: boolean,
    ) {
        this.city = city;
        this.quarter = quarter;
        this.deliveryDate = deliveryDate;
        this.deliveryHoures = deliveryHoures;
        this.codePromo = codePromo;
        this.indiqueName = indiqueName;
        this.indiqueNumber = indiqueNumber;
        this.longitude = longitude;
        this.latitude = latitude;
        this.userId = userId;
        this.id = id;
        this.isActived = isActived;
        this.isVisible = isVisible;
    }
}