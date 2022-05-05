export class DateHelper{

    public static obterHoraEmMinuto(hora:string): number{
        if( hora && hora.includes(":")){
            let hour = hora.split(":");
            return ( Number(hour[0]) * 60 + Number(hour[1]) );
        }
        return 0;
    }

    public static obterHoraFormatada(data:number): string{
        if ( !data ){
            return "00:00";
        }
        let hora = ""+ (Math.floor(data / 60));
        let minutos =""+ (Math.floor(data % 60));

        if(hora.length == 1){
            hora = "0"+hora;
        }
        if(minutos.length == 1){
            minutos = "0"+minutos;
        }

        return hora + ":" + minutos;
    }

    public static getDoisDigitos(val){
        if( val < 10 ){
            return 0+""+val;
        }
        return val;
    }

    public static timeIsValid(hora:string):boolean{
        let isvalid = false;
        if( hora ){
            if( hora.length === 5){
                const horas = hora.split(":");
                if( Number(horas[0]) <= 23 && Number(horas[1]) <= 59){
                    isvalid = true;
                }
            }
        }
        return isvalid;
    }
}