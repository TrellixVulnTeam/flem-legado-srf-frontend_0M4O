import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FuncionarioService {

  PATH: string = "funcionarios/";

  constructor(private http: HttpClient) { }

  getBy(value, path) {

    return this.http.get(environment.baseUrl + this.PATH + path + "/" + value)
      .map(
        (res: any) => res
      )
      .catch(
        this._errorHandler
      );
  }

  getSituacaoFuncionario() {
    return this.http.get(environment.baseUrl + this.PATH + "situacaoFuncionario")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  _errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || "Internal server error");
  }

  getDadosRH(id:any) {
    return this.http.get(environment.baseUrl + this.PATH  + id +'/dadosrh')
      .map(
        (res: Response) => res
      )
      .catch(
        this._errorHandler
      );
  }
}
