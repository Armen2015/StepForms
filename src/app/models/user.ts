export class User {
    id: number;
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    address: string;
    address2: string;
    postalCode: string;
    legal: string;
    // shipping data
    shipCountry: string;
    shipCity: string;
    shipAddress: string;
    shipAddress2: string;
    shipPostalCode: string;
    shipLegal: string;
    //   ----
    userName: string;
    password: string;
    package: string;
    // user card data
    cardNumber: number;
    cardName: string;
    cardCvc: number;
    cardExpDate: number;
}
