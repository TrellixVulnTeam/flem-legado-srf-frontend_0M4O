import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class EmitirEventoService {

  mensagem = new EventEmitter();

  constructor() { }

  emitir(type, data){
    this.mensagem.emit({type: type, data: data});
  }

}
