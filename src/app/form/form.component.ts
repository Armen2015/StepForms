import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  step = 1;
  cardDate = false;
  user: any = {};

 
  next() {
    this.step++;
  }

  prev() {
    this.step--;
  }

  sign() {
    this.step++;
    console.log(this.user);
  }

  // checks date
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

  // watch for date changes
  dataChange(e) {
    if(e.length == 10) this.cardDate = true;
    else this.cardDate = false;
  }

  // listen to keydown events
  @HostListener('keydown', ['$event']) onKeyDown(e) {
    // enable backspace 
    if(e.keyCode == 8) return;

    if(e.target.name === "form_credit_card_expiration_date"){
      if(this.checkDate(e, 0, 0, 3)) return;
      if(this.checkDate(e, 1, 0, 9)) return;
      if(((e.target.value.length === 2 || e.target.value.length === 5) && e.key != '/') 
          || e.target.value.length > 9) {
        e.preventDefault();
        return;
      }
      if(this.checkDate(e, 3, 0, 1)) return;
      if(this.checkDate(e, 4, 0, 9)) return;
      if(this.checkDate(e, 6, 1, 9)) return;
      if(this.checkDate(e, 7, 0, 9)) return;
      if(this.checkDate(e, 8, 0, 9)) return;
      if(this.checkDate(e, 9, 0, 9)) return;
      return;
    }

    // if pattern not exist then return
    if(e.target.pattern == void 0) return;
    var regEx =  new RegExp(e.target.pattern); 
    if(e.target.pattern.length == 0) return;

    //check pressed key by given pattern
    if(regEx.test(e.key))
      return;
    else
    e.preventDefault();
  }
}
