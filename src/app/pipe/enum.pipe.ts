import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enum'
})
export class EnumPipe implements PipeTransform {

  transform(value: any, args:string[]): any {
    let keys = [];
    for (var enumMember in value) {
      keys.push({key: enumMember, value: value[enumMember]});
    }
    return keys;
  }

}
