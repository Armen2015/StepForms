import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Options } from '../models/options';
import { User } from '../models/user';


@Component({
  selector: 'app-reactiveform',
  templateUrl: './reactiveform.component.html',
  styleUrls: ['./reactiveform.component.css']
})
export class ReactiveformComponent implements OnInit {
  // Declaring forms
  step1: FormGroup;
  step2: FormGroup;
  step3: FormGroup;
  currentStep = 1;
  // card valid
  cardDateValid: boolean;
  cardNumberValid: boolean;
  userNameValid: boolean;
  isDataChecked: boolean;
  user: User;
  options: any = null;
  isLegalCompany: boolean;
  cardType: string;
  empty = 'Not metioned'
  

  private step1SubmitAttempt: boolean = false;
  private step2SubmitAttempt: boolean = false;
  private step3SubmitAttempt: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService
  ) { }
  ngOnInit() {
    this.user = new User();
    this.options = Options;
    this.cardDateValid = true;
    this.cardNumberValid = true;
    this.isDataChecked = false;
    this.isLegalCompany = false;
    this.cardType = null;
    // First form init
    this.step1 = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country:  new FormControl(null, Validators.required),
      city: ['', Validators.required],
      address: ['', Validators.required],
      address2: '',
      postalCode: ['', Validators.required
      ],
      legal:  new FormControl(null, Validators.required),
      companyName: ['', Validators.required],
      isDataChecked: new FormControl(false),
      shipCountry:  new FormControl(null, Validators.required),
      shipCity: ['', Validators.required],
      shipAddress: ['', Validators.required],
      shipAddress2: '',
      shipPostalCode: ['', Validators.required]
    });
    // Second form init
    this.step2 = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      package: ['', Validators.required]
    });
    // Third form init
    this.step3 = this.fb.group({
      cardNumber: ['', Validators.required],
      cardName: ['', Validators.required],
      cardCvc: ['', Validators.required],
      cardExpDate: ['', Validators.required]
    });
  }



/***************  Button events  **************/

  // Next button
  nextBtn() {
    var form = this['step' + this.currentStep];
    this["step" + this.currentStep + 'SubmitAttempt'] = true;
    //console.log(form.get('isDataChecked'));
    if (!form.valid) {
      console.log(form.controls);
      Object.keys(form.controls).forEach(field => { 
        const control = form.get(field);            
        control.markAsTouched({ onlySelf: true });       
      });
    } else {
      if(this.userNameValid) return;
      if(this.currentStep == 3) {
        if(!this.cardDateValid || !this.cardNumberValid) return;
        this.user = Object.assign(
          {},
          JSON.parse(JSON.stringify(this.step1.getRawValue())), 
          JSON.parse(JSON.stringify(this.step2.value)), 
          JSON.parse(JSON.stringify(this.step3.value))
        );
        var country = this.user.country.Country;
        var legal = this.user.legal.label;
        var shipCountry = this.user.shipCountry.Country;
        this.user.country = country;
        this.user.legal = legal;
        this.user.shipCountry = shipCountry;
        console.log('user', this.user);
      }
      this.currentStep++;
    }
  }

  // Previous button
  prevBtn() {
    this.currentStep--;
  }

  signUpBtn() {
    this.userService.create(this.user)
        .subscribe(
            data => {
              console.log(data);
              this.currentStep++;
            },
            error => {
            
            });
  }


/************ OnChange Events  **********/

  // Sets error class to an element, when it is not valid
  setClass(form_element: string) {
    var form = 'step' + this.currentStep;
    if( this.isDataChecked && form_element.substring(0, 4) === 'ship' && form === "step1" ) {
      return {
        'disabled': true
      };
    }
    if(form_element === 'userName' && form === 'step2')
      return {
        'input-error': this.userNameValid || this.isFieldValid(form_element, form)
      };
    return {
      'input-error': this.isFieldValid(form_element, form)
    };
  }

  // Checks form element valid or not
  isFieldValid(form_element: string, form: string) {
    return !this[form].get(form_element).valid && this[form].get(form_element).touched ||
    (this[form].get(form_element).untouched && this[form + 'SubmitAttempt']);
  }

  // If checkbox triggered, add filled data to shiping data
  chBoxChange() {
    this.isDataChecked = !this.step1.get('isDataChecked').value;
    if(this.isDataChecked) {
      for(var key in this.step1.controls) {
        if(key.substring(0, 4) === 'ship') {
          var dataKey = key.slice(4);
          dataKey = dataKey.charAt(0).toLowerCase() + dataKey.slice(1);
          this.step1.get(key).disable();
          this.step1.get(key).setValue(this.step1.get(dataKey).value);
        }
      }
    }
    else {
      for(var key in this.step1.controls) {
        if(key.substring(0, 4) === 'ship') {
          this.step1.get(key).enable();
        }
      }
    }
  }

  // If checkbox checked, watch for data changes
  shippingDataChange(form_element){
    if(form_element === 'country'){
      var regex = this.step1.get('country').value.Regex;
      this.step1.get('postalCode').setValidators([
          Validators.required,
          Validators.pattern(regex)
      ]);
      this.step1.get('postalCode').updateValueAndValidity();
    }
    if(form_element === 'shipCountry'){
      var regex = this.step1.get('shipCountry').value.Regex;
      this.step1.get('shipPostalCode').setValidators([
          Validators.required,
          Validators.pattern(regex)
      ]);
      this.step1.get('shipPostalCode').updateValueAndValidity();
    }

    if(form_element === 'legal'){
      var value = this.step1.get(form_element).value.label;
      if(value === 'Company'){
        this.isLegalCompany = true;
        this.step1.get('companyName').setValidators([ Validators.required ]);
        this.step1.get('companyName').updateValueAndValidity();
        return;
      }
      else {
        this.step1.get('companyName').setValidators([ ]);
        this.step1.get('companyName').updateValueAndValidity();
      }
      this.isLegalCompany = false;
      this.step1.get('companyName').setValue('');
      return;
    }

    if(!this.isDataChecked) return;
    var shipKey = 'ship' + form_element.charAt(0).toUpperCase() + form_element.slice(1);
    this.step1.get(shipKey).setValue(this.step1.get(form_element).value);
  }

  // Check if username exists
  checkUserName(element) {
    var name = element.value;
    this.userService.checkUser(name)
    .subscribe(
      data => {
        this.userNameValid = <boolean>data;
      },
      error => {
        
      });
  }

  // Validates card number
  numberChange(e) {
    this.cardType =  this.detectCardType(e);
    if(e.length == 16) this.cardNumberValid = true;
    else this.cardNumberValid = false;
  }

  // Watch for date changes
  dateChange(e) {
    if(e.length == 8) this.cardDateValid = true;
    else this.cardDateValid = false;
  }

  // Checks date
  checkDate(e, position, start, end) {
    var length = e.target.value.length;
    if(length === position) {
      if(length == 1 && e.target.value[0] == '0') start = 1;
      if(length == 1 && e.target.value[0] == '3') { start = 0; end = 1; }
      if(length == 4 && e.target.value[3] == '0') start = 1;
      if(length == 4 && e.target.value[3] == '1') end = 2;   
      if(!(e.key >= start && e.key <= end)) {
        e.preventDefault();
        return true;
      }
    }
    return false;
  }

  // Listen to keydown events
  @HostListener('keydown', ['$event']) onKeyDown(e) {
    // enable backspace 
    if(e.keyCode == 8) return;
    if(e.target.name === "form_credit_card_expiration_date"){
      if(this.checkDate(e, 0, 0, 3)) return;
      if(this.checkDate(e, 1, 0, 9)) return;
      if(this.checkDate(e, 3, 0, 1)) return;
      if(this.checkDate(e, 4, 0, 9)) return;
      if(this.checkDate(e, 6, 1, 9)) return;
      if(this.checkDate(e, 7, 0, 9)) return;
      if(this.checkDate(e, 8, 0, 9)) return;
      if(this.checkDate(e, 9, 0, 9)) return;
      return;
    }
  }

  // 
  detectCardType(number) {
    var re = {
        electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
        //dankort: /^(5019)\d+$/,
        //interpayment: /^(636)\d+$/,
        //unionpay: /^(62|88)\d+$/,
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        //amex: /^3[47][0-9]{13}$/,
        //diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        //jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    }

    for(var key in re) {
        if(re[key].test(number)) {
            return key
        }
    }
    return null;
  }

}