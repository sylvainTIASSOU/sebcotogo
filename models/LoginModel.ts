export class LoginModel {
    phone: number;
    password: string;

    constructor(phone: number, password: string) {
        this.password = password;
        this.phone = phone;
    }
}