import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'cardnumber'})
export class CardNumber implements PipeTransform {
  transform(value: string, args: string[]): any {
    if(value == void 0 || value == null) return 'undefined';
    var newValue = '';
    for(var i = 0; i < value.length; ++i) {
      if(i != 0 && i % 4 == 0) newValue += ' ';
      newValue += value.charAt(i);
    }
    return newValue;
  }
}