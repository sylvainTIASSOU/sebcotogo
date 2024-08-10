export class ProviderModel {

    name: string
    address: string
    phone: string
    type: string
    id?: number
    isVisible?: boolean
    isActived?: boolean

    constructor(
        name: string,
        address: string,
        phone: string,
        type: string,
        id?: number,
        isVisible?: boolean,
        isActived?: boolean
    ) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.type = type;
        this.id = id;
        this.isVisible = isVisible;
        this.isActived = isActived;
    }
}