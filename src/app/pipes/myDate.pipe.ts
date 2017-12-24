import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'mydate'})
export class MyDate implements PipeTransform {
  transform(value: string, args: string[]): any {
    if(value == void 0 || value == null) return 'undefined';
    var newValue = '';
    newValue += value.substring(0, 2) + '/';
    newValue += value.substring(2, 4) + '/';
    newValue += value.substring(4);
    return newValue;
  }
}