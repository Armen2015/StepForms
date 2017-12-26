import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
 
@Component({
  selector: 'app-form3',
  templateUrl: './form3.component.html',
  styleUrls: ['./form3.component.css']
})
export class Form3Component implements OnInit {
  
  step3: FormGroup;
  cardDateValid: boolean;
  cardNumberValid: boolean;
  user: User;
  cardType: string;
  cardMask = '0000 0000 0000 000';
  step3SubmitAttempt: boolean = false;
  
  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit() {
    console.log(this.userService.user);
    this.cardDateValid = true;
    this.cardNumberValid = false;
    this.cardType = null;

    // Third form init
    this.step3 = this.fb.group({
      cardNumber: ['', Validators.required],
      cardName: ['', Validators.required],
      cardCvc: ['', Validators.compose([
          Validators.required, 
          Validators.minLength(3),
          Validators.pattern('^[0-9]+$')
        ])
      ],
      cardExpDate: ['', Validators.required]
    });
  }
  // Next button
  nextBtn() {
    var form = this.step3;
    this.step3SubmitAttempt = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach(field => { 
        const control = form.get(field);            
        control.markAsTouched({ onlySelf: true });       
      });
    } else {
        if(!this.cardDateValid || !this.cardNumberValid) return;

        // this.user = Object.assign(
        //   {},
        //   JSON.parse(JSON.stringify(this.step1.getRawValue())), 
        //   JSON.parse(JSON.stringify(this.step2.value)), 
        //   JSON.parse(JSON.stringify(this.step3.value))
        // );
        // var country = this.user.country.Country;
        // var legal = this.user.legal.label;
        // var shipCountry = this.user.shipCountry.Country;
        // this.user.country = country;
        // this.user.legal = legal;
        // this.user.shipCountry = shipCountry;
        // console.log('user', this.user);
    }
  }

  // Previous button
  prevBtn() {
    this.router.navigateByUrl('/step2');
  }

  // Sets error class to an element, when it is not valid
  setClass(form_element: string) {
    var form = this.step3;
    return {
      'input-error': this.isFieldValid(form_element)
    };
  }

  // Checks form element valid or not
  isFieldValid(form_element: string) {
    var element = this.step3.get(form_element);
    return !element.valid && element.touched || (element.untouched && this.step3SubmitAttempt);
  }

  // Validates card number
  numberChange() {
    var value = this.step3.get('cardNumber').value;
    this.cardType =  this.detectCardType(value);
    if(this.cardType !== 'amex') this.cardMask = '0000 0000 0000 0000';
    else this.cardMask = '0000 0000 0000 000';
    if(value.length === 16 || (this.cardType === 'amex' && value.length === 15)) this.cardNumberValid = true;
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
        amex: /^3[47][0-9]{13}$/,
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


