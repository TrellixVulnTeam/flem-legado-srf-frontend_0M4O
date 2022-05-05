import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ContatosService {

  PATH = "contato/";

  constructor(public http: HttpClient) { }

  save(contato) {
    return this.http.post(environment.baseUrl + this.PATH, contato)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  edit(contato) {
    return this.http.put(environment.baseUrl + this.PATH, contato)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }
  
  getList() {
    return this.http.get(environment.baseUrl + this.PATH +"lista")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getContato(id) {
    return this.http.get(environment.baseUrl + this.PATH+id+"/contato")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getContatoProjeto(id) {
    return this.http.get(environment.baseUrl + this.PATH+id+"/projeto")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  remove(id){
    return this.http.delete(environment.baseUrl+this.PATH+"/"+id)
    .map((response: any) => response)
    .catch(this._errorHandler);
  }

getFuncionarios(){
    return this.http.get(environment.baseUrl+this.PATH+"funcionarios")
    .map((response: any) => response)
    .catch(this._errorHandler);
  }

  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }


}
