import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boolean'
})
export class BooleanPipe implements PipeTransform {

  transform(value: boolean, args: any[]): string {
    let retorno = "";
    if( args && args.length > 0 ){
      if( args.length === 1 ){
        retorno = args[0];
      }else{
        retorno = value ? args[0] : args[1];
      }
    }
    return retorno;
  }

}
