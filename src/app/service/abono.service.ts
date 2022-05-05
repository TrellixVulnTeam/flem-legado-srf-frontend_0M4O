import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AbonoService {

  PATH = "abonos/";

  constructor(public http: HttpClient) { }

  gerarAbonosFromAtestado(idAtestado, abonos) {
    return this.http.post(environment.baseUrl + this.PATH + "atestado/" + idAtestado, abonos)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  approveOrDisapprove(pathLocal, obj) {
    return this.http.put(environment.baseUrl + this.PATH + pathLocal, obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  approveOrDisapproveList(abonos) {
    return this.http.put(environment.baseUrl + this.PATH + "aprovarAbonoEmLote", abonos)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  getHistory(idDia) {
    return this.http.get(environment.baseUrl + this.PATH + "historico/" + idDia)
      .map((res: any) => res)
      .catch(this._errorHandler);
  }

  aprovarAtestadoMedicoOrOutrasFaltas(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "aprovarAtestadoMedicoOrOutrasFaltas" , obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  reprovarAtestadoMedicoOrOutrasFaltas(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "reprovarAtestadoMedicoOrOutrasFaltas" , obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getFrequenciasComAbonos(abonos) {
    return this.http.post(environment.baseUrl + this.PATH + "frequenciasComAbonos",abonos)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  pesquisarAbonos(abonos) {
    return this.http.post(environment.baseUrl + this.PATH + "pesquisar",abonos)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  aprovar(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "aprovar" , obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  reprovar(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "reprovar" , obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  reabrir(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "reabrir" , obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  
  reabrirEmLote(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "reabrirEmLote" , obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getHistoryAbono(id) {
    return this.http.get(environment.baseUrl + this.PATH +id+ "/historicoAbono")
      .map((res: any) => res)
      .catch(this._errorHandler);
  }

  aprovarEmLote(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "aprovarEmLote" , obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  reprovarEmLote(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "reprovarEmLote" , obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }



  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }

}
