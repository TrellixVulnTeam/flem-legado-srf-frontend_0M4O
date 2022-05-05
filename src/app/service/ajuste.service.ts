import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class AjusteService {

  PATH = "ajustes/";

  constructor(public http: HttpClient) { }

  salvar(ajuste) {
    return this.http.post(environment.baseUrl + this.PATH+"salvarAjuste" ,ajuste)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  
  _errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || "Internal server error");
  }

}
