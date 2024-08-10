export class PromotionModel {
    beginDate: string;
    endDate: string;
    description?: string;
    id?: number;
    isVisible?: boolean;
    isActived?: boolean;

    constructor(
        beginDate: string,
    endDate: string,
    description?: string,
        id?: number,
    isVisible?: boolean,
    isActived?: boolean

    ) {
        this.description = description;
        this.endDate = endDate;
        this.beginDate = beginDate;
        this.id = id;
        this.isVisible = isVisible;
        this.isActived = isActived;
    }
}