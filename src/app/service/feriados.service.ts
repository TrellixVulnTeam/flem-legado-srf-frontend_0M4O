import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Constante } from '../model/constants';
import { environment } from 'environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable()
export class FeriadosService {

  PATH = "feriados";

  constructor(public http: HttpClient) { }

  getList(){
    return this.http.get(environment.baseUrl+this.PATH)
      .map(
        (res: Response) => res
      )
      .catch(
        this._errorHandler
      );
  }

  get(id:any){
    return this.http.get(environment.baseUrl+this.PATH+"/"+id)
      .map(
        (res: Response) => res
      )
      .catch(
        this._errorHandler
      );
  }

  movimentacoes(id:any){
    return this.http.get(environment.baseUrl+this.PATH+"/"+id+"/movimentacoes")
      .map(
        (res: Response) => res
      )
      .catch(
        this._errorHandler
      );
  }

  save(feriado){
    return this.http.post(environment.baseUrl+this.PATH+"/novo" , feriado)
      .map((response: Response) => HttpErrorResponse)
      .catch(this._errorHandler);
  }

  update(feriado){
    return this.http.put(environment.baseUrl+this.PATH , feriado)
    .map((response: Response) => response)
    .catch(this._errorHandler);
  }

  mover(feriado){
    return this.http.put(environment.baseUrl+this.PATH+"/mobilidade" , feriado)
    .map((response: Response) => response)
    .catch(this._errorHandler);
  }
  
  delete(id){
    return this.http.delete(environment.baseUrl+this.PATH+"/remove/"+id)
    .map((response: Response) => response)
    .catch(this._errorHandler);
  }

  deleteMovimentacao(idFeriado, seq){
    return this.http.delete(environment.baseUrl+this.PATH+"/"+idFeriado+"/movimentacoes/"+seq)
    .map((response: Response) => response)
    .catch(this._errorHandler);
  }

  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }

}
