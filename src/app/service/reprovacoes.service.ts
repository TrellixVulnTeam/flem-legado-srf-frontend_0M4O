import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReprovacoesService {

  PATH = "tiposReprovacao/";
  
  constructor(public http: HttpClient) { }

  getListaReprovacoes() {
    return this.http.get(environment.baseUrl + this.PATH + "listaReprovacoes")
      .map((res: any) => res)
      .catch(this._errorHandler);
  }

  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }


}
