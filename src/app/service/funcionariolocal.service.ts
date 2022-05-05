import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class FuncionariolocalService {

  PATH: string = "funcionariolocal/";

  constructor(private _http: HttpClient) { }

  all() {
    return this._http.get(environment.baseUrl + this.PATH + "funcionarios")
      .map(
        (res: any) => res
      );
  }

  getSituacaoFuncionario() {
    return this._http.get(environment.baseUrl + this.PATH + "situacaoFuncionario")
      .map(
        (res: any) => res
      );
  }


  enable(matricula) {
    return this._http.put(environment.baseUrl + this.PATH + matricula + "/enabled", null)
      .map(
        (res: any) => res
      );
  }

  getFuncionarioDTO(matricula) {
    return this._http.get(environment.baseUrl + this.PATH + matricula + "/funcionario")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  atualizarConfiguracao(obj) {
    return this._http.put(environment.baseUrl + this.PATH + "configurar", obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }


}
