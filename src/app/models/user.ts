export class User {
    id: number;
    firstName: string;
    lastName: string;
    country: any = null;
    city: string;
    address: string;
    address2: string;
    postalCode: string;
    legal: any = null;
    companyName: string = null;
    // shipping data
    shipCountry: any = null;
    shipCity: string;
    shipAddress: string;
    shipAddress2: string;
    shipPostalCode: string;
    isChecked: boolean = true;
    //   ----
    userName: string;
    password: string = '';
    package: string = null;
    // user card data
    cardNumber: string;
    cardName: string;
    cardCvc: number;
    cardExpDate: string;
}
