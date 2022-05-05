import { Injectable } from '@angular/core';
import { Response, Http, RequestOptions, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Marcacao } from '../model/marcacao';

@Injectable()
export class MarcacoesService {

  constructor(public http: HttpClient) { }

  PATH = "marcacoes/";


  saveMarcacao(marcacoes: Marcacao) {
    // console.log(environment.baseUrl + this.PATH + "/salvarMarcacoes", marcacoes);
    return this.http.put(environment.baseUrl + this.PATH + "/salvarMarcacoes", marcacoes)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  removerMarcacao(id, observacao) {
    return this.http.put(environment.baseUrl + this.PATH + "delete", { id: id, observacao: observacao })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  getHistory(idDia) {
    return this.http.get(environment.baseUrl + this.PATH + "historico/" + idDia)
      .map((res: any) => res)
      .catch(this._errorHandler);
  }

  approveOrDisapprove(marcacoes, pathLocal: string) {
    return this.http.put(environment.baseUrl + this.PATH + pathLocal, marcacoes)
      .map((res: Response) => res)
      .catch(this._errorHandler);
  }

  verificarInconsistencia(id) {
    return this.http.get(environment.baseUrl + this.PATH + id + "/inconsistencia")
      .map((res: Response) => res)
      .catch(this._errorHandler);
  }


  _errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || "Internal server error");
  }



}
