import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateHelper'
})
export class DateHelperPipe implements PipeTransform {
  semana: string[] = ["Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado", "Domingo"];

  transform(value: any, ...args) {
    if( value ){
      if(args[0] === 'time'){
        return this.getTime(value);
      }else if(args[0] === 'date'){
        return this.getDate(value);
      }else if(args[0] === 'number'){
        return this.getDoisDigitos(value);
      }else if(args[0] === 'dayOfWeek'){
        return this.getDiaDaSemana(value);
      }
    }else{
      return "00:00";
    }
  }

  getTime(value){
    const horas = Number(value / 60);
    const minutos = Number(value % 60);
    let horaFormatada = this.getHorario( this.getDoisDigitos(Math.floor(horas)), this.getDoisDigitos(Math.floor(minutos)));
    if( horaFormatada.includes("-")){
      horaFormatada = horaFormatada.replace(/-/g,"");
      horaFormatada = "-"+horaFormatada;
    }

    return horaFormatada;

  }

  getDate( date ){

    if(Array.isArray(date)){
      let dia = this.getDoisDigitos(date[2]);
      let mes = this.getDoisDigitos(date[1]);
      let ano = date[0];
      return dia + "/" + mes + "/" + ano;
    }else{
      let dia = this.getDoisDigitos(date.dayOfMonth);
      let mes = this.getDoisDigitos(date.monthValue);
      let ano = date.year;
      return dia + "/" + mes + "/" + ano;
    }

  }
  getDoisDigitos(val){
    if( val < 10 && val > -10){
      return 0+""+val;
    }
    return val;
  }

  getHorario( hora, minutos ):string{
    let horaPedido = hora + ":" + minutos;
    return horaPedido;
  }

  getDiaDaSemana(data) {
    data = data.substring(6, 10) + "-" + data.substring(3, 5) + "-" + data.substring(0, 2);
    let d = new Date(data);
    return this.semana[d.getDay()];
  }

  horaParaMinutos(horaFormatada){
    const {hora, minuto} = horaFormatada.split(":");
    const minutos = (Math.floor(Number(hora)) * 60) + Math.floor(Number(minuto));
    return minutos;
  }


}
