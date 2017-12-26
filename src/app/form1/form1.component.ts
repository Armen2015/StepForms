import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Options } from '../models/options';
import { Router } from '@angular/router';
import { User } from '../models/user';


@Component({
  selector: 'app-form1',
  templateUrl: './form1.component.html',
  styleUrls: ['./form1.component.css']
})
export class Form1Component implements OnInit {

  step1: FormGroup;
  user: User;
  isDataChecked: boolean;
  isLegalCompany: boolean;
  options: any = null;
  step1SubmitAttempt: boolean = false;

  constructor( 
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService, 
  ) { }

  ngOnInit() {
    this.user = this.userService.user;
    this.isDataChecked = false;
    this.isLegalCompany = false;
    this.options = Options;

    // First form init
    this.step1 = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country:  new FormControl(null, Validators.required),
      city: ['', Validators.required],
      address: ['', Validators.required],
      address2: '',
      postalCode: ['', Validators.required],
      legal:  new FormControl(null, Validators.required),
      companyName: '',
      isDataChecked: new FormControl(this.isDataChecked),
      shipCountry:  new FormControl(null, Validators.required),
      shipCity: ['', Validators.required],
      shipAddress: ['', Validators.required],
      shipAddress2: '',
      shipPostalCode: ['', Validators.required]
    });
    if(this.user.isChecked) this.emitCheckboxClick();
  }

  // Next button
  nextBtn() {
    var form = this.step1;
    this.step1SubmitAttempt = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach(field => { 
        var control = form.get(field);            
        control.markAsTouched({ onlySelf: true });       
      });
    }
    else {
      this.router.navigateByUrl('/step2');
    } 
  }

  // Sets error class to an element, when it is not valid

  setClass(form_element: string) {
    if( this.isDataChecked && form_element.substring(0, 4) === 'ship') {
      return {
        'disabled': true
      };
    }
    return {
      'input-error': this.isFieldValid(form_element)
    };
  }

  // Checks form element valid or not
  isFieldValid(form_element: string) {
    var element = this.step1.get(form_element);
    return !element.valid && element.touched || (element.untouched && this.step1SubmitAttempt);
  }

  // Perform checkbox click
  emitCheckboxClick(){
    this.isDataChecked = !this.isDataChecked;
    this.inputsStateToggle();
    var el = this.step1.get('isDataChecked');
    el.setValue(!el.value);
  }

  // If checkbox triggered, add filled data to shiping data or disable inputs
  inputsStateToggle() {
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
      var regex;
      for(var i = 0; i < this.options.length; ++i){
        if(this.options[i].Country === this.step1.get('country').value)
          regex = this.options[i].Regex;
      }
      this.step1.get('postalCode').setValidators([
          Validators.required,
          Validators.pattern(regex)
      ]);
      this.step1.get('postalCode').updateValueAndValidity();
    }
    if(form_element === 'shipCountry'){
      var regex;
      for(var i = 0; i < this.options.length; ++i){
        if(this.options[i].Country === this.step1.get('shipCountry').value)
          regex = this.options[i].Regex;
      }
      this.step1.get('shipPostalCode').setValidators([
          Validators.required,
          Validators.pattern(regex)
      ]);
      this.step1.get('shipPostalCode').updateValueAndValidity();
    }
    if(form_element === 'legal'){
      var value = this.step1.get(form_element).value;
      if(value === 'Company'){
        this.isLegalCompany = true;
        this.updateValidators(this.step1.get('companyName'), [ Validators.required ]);
        return;
      }
      this.updateValidators(this.step1.get('companyName'), []);
      this.isLegalCompany = false;
      this.step1.get('companyName').setValue('');
      return;
    }

    if(!this.isDataChecked) return;
    var shipKey = 'ship' + form_element.charAt(0).toUpperCase() + form_element.slice(1);
    this.step1.get(shipKey).setValue(this.step1.get(form_element).value);
  }

  // Set and update form element validators
  updateValidators(form_element, validator){
    form_element.setValidators(validator);
    form_element.updateValueAndValidity();
  }
}
