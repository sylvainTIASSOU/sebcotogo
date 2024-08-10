export class CommentModel {
    content: string;
    date: string;
    userId: number;
    id?: number;
    isVisible?: boolean;
    isActived?: boolean;


    constructor(
        content: string,
        date: string,
        userId: number,
        id?: number,
        isVisible?: boolean,
        isActived?: boolean
    ) {
        this.content = content;
        this.date = date;
        this.userId = userId;
        this.id = id;
        this.isActived = isActived;
        this.isVisible = isVisible;

    }
}