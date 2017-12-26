import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

import { Router } from '@angular/router';
import { User } from '../models/user';
import { ValidatePass } from '../validators/pass.validator';
import { Popup } from 'ng2-opd-popup';

@Component({
  selector: 'app-form2',
  templateUrl: './form2.component.html',
  styleUrls: ['./form2.component.css']
})
export class Form2Component implements OnInit {

  step2: FormGroup;
  user: User;
  step2SubmitAttempt: boolean = false;
  userNameValid: boolean;
  sponsorUserName: string;
  sponsorFirstName: string;
  sponsorLastName: string;
  loading: boolean = false;
  showSponsor: boolean = false;
  errorSponser: boolean = false;
  isSponsorValid: boolean = false;
  btnSubm: boolean = false;
  infoSources = ['Google Search', 'Social Media', 'Friend'];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private userService: UserService,
    private popup: Popup
  ) { }

  ngOnInit() {
    this.user = this.userService.user;
    this.sponsorUserName = '';
    // Second form init
    this.step2 = this.fb.group({
      userName: ['', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.-]*$')
        ])
      ],
      password: ['', [ Validators.required, /*Validators.minLength(2)/*, ValidatePass*/ ]],
      //RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
      package: ['', Validators.required],
      facebook: ['', Validators.compose([
          
          Validators.pattern(/(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/)
        ])
      ],
      twitter: ['', Validators.compose([
          Validators.required, 
          Validators.pattern(/(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/)
        ])
      ],
      infoSource: new FormControl(null, Validators.required),
      sponsorUserName: '',
      sponsorFirstName: '',
      sponsorLastName: ''
    });
    this.step2.get('sponsorUserName').disable();
    this.step2.get('sponsorFirstName').disable();
    this.step2.get('sponsorLastName').disable();
    if( this.user.package !== null ) this.packageDataChange();
  }

  nextBtn() {
    var form = this.step2;
    this.step2SubmitAttempt = true;
    if (!form.valid) {
      Object.keys(form.controls).forEach(field => { 
        const control = form.get(field);            
        control.markAsTouched({ onlySelf: true });       
      });
    } else {
      if(this.userNameValid) return;
      if(form.get('infoSource').value === 'Friend') {
        if(!this.isSponsorValid) {
          this.btnSubm = true;
          return;
        }
      }
      this.router.navigateByUrl('/step3');
    }
  }

  // Previous button
  prevBtn() {
    this.router.navigateByUrl('/step1');
  }

  // Opens sponsor search window
  findSponsorWindowBtn(){
    // Popup window options
    this.popup.options = {
      header: "Sponsor Search",
      color: "#19B9E7", 
      widthProsentage: 65, 
      animationDuration: 1, 
      showButtons: true, 
      confirmBtnContent: "Search", 
      cancleBtnContent: "Cancel", 
      confirmBtnClass: "btn btn-next", 
      cancleBtnClass: "btn btn-next", 
      animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown' 
    };
    this.popup.show(this.popup.options);
  }

  findSponsorBtn(){
    this.errorSponser = false;
    if(this.sponsorUserName === '') return;
    if(!/\S/.test(this.sponsorUserName)) return;
    this.loading = true;
    this.sponsorUserName = this.sponsorUserName.trim();
    this.userService.findSponsor(this.sponsorUserName)
    .subscribe(
      data => {
        this.loading = false;
        if(!data) this.errorSponser = true;
        else {
          for(var key in data){
            if (key == 'sponsorFirstName') this.sponsorFirstName = data[key];
            if (key == 'sponsorLastName') this.sponsorLastName = data[key];
          }
          this.showSponsor = true;
        }
      },
      error => {
        
      }
    )
  }

  addSponsor(){
    this.step2.get('sponsorUserName').setValue(this.sponsorUserName);
    this.step2.get('sponsorFirstName').setValue(this.sponsorFirstName);
    this.step2.get('sponsorLastName').setValue(this.sponsorLastName);
    this.isSponsorValid = true;

    this.popup.hide();
    this.sponsorUserName = '';
    this.sponsorFirstName = '';
    this.sponsorLastName = '';
    this.showSponsor = false;
    this.errorSponser = false;
    this.btnSubm = false;
  }

  // Sets error class to an element, when it is not valid
  setClass(form_element: string) {
    if(form_element === 'userName')
      return {
        'input-error': this.userNameValid || this.isFieldValid(form_element)
      };
    return {
      'input-error': this.isFieldValid(form_element)
    };
  }

  // Checks form element valid or not
  isFieldValid(form_element: string) {
    var element = this.step2.get(form_element);
    return !element.valid && element.touched || (element.untouched && this.step2SubmitAttempt);
  }

  // Permorm package radio button click
  packageRadioBtnClick(value) {
    console.log(value);
    this.step2.get('package').setValue(value);
    this.packageDataChange();
  }

  // 
  packageDataChange() {
    var packageType = this.step2.get('package').value;
    if(packageType === 'Standard Package') {
      this.updateValidators(this.step2.get('facebook'), [ 
        Validators.required,
        Validators.pattern(/(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/)
      ]);
      this.updateValidators(this.step2.get('twitter'), [ 
        Validators.required,
        Validators.pattern(/(?:http:\/\/)?(?:www\.)?twitter\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/) 
      ]);
      this.updateValidators(this.step2.get('infoSource'), []);
    }
    if(packageType === 'Premium Package') {
      this.updateValidators(this.step2.get('facebook'), []);
      this.updateValidators(this.step2.get('twitter'), []);
      this.updateValidators(this.step2.get('infoSource'), [ 
        Validators.required,
      ]);
    }
  }

  premiumDataChange() {
    //var source = this.step2.get('package').value
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
        
      }
    );
  }


  // Set and update form element validators
  updateValidators(form_element, validator){
    form_element.setValidators(validator);
    form_element.updateValueAndValidity();
  }
}
