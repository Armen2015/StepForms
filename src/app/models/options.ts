import * as data from '../data.files/postal-codes.json';

var obj = (<any>data);

var legal = {
    legalOptions: [
        { 
            id: 1, 
            label: 'Company' 
        }, 
        { 
            id: 2, 
            label: 'Individual' 
        }
    ],
}

export const Options = Object.assign(obj, legal);
