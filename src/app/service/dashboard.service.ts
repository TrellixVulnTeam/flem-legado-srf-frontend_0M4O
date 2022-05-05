import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Constante } from '../model/constants';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DashboardService {

  PATH = "dashboard";

  constructor(public http: HttpClient) { }

  projetos(){
  
    return this.http.get(environment.baseUrl+this.PATH+"/projetos")
    .map(
      (res: Response) => res
    )
    .catch(
      this._errorHandler
    );
  }

  funcionariosPorProjeto(id){
    return this.http.get(environment.baseUrl+this.PATH+"/projeto/"+id+"/funcionarios")
    .map(
      (res: any) => res
    )
    .catch(
      this._errorHandler
    );
  }

  funcionariosPorProjetoTrabalhando(id){
    return this.http.get(environment.baseUrl+this.PATH+"/projeto/"+id+"/trabalhando")
    .map(
      (res: any) => res
    )
    .catch(
      this._errorHandler
    );
  }

  funcionariosPorProjetoNaoTrabalhando(id){
    return this.http.get(environment.baseUrl+this.PATH+"/projeto/"+id+"/naotrabalhando")
    .map(
      (res: any) => res
    )
    .catch(
      this._errorHandler
    );
  }

  funcionariosPorProjetoInativos(id){
    return this.http.get(environment.baseUrl+this.PATH+"/projeto/"+id+"/inativos")
    .map(
      (res: any) => res
    )
    .catch(
      this._errorHandler
    );
  }

  funcionariosSemRegistrosPorProjeto(id, matriculas){
    return this.http.post(environment.baseUrl+this.PATH+"/projeto/"+id+"/semregistros", matriculas)
    .map(
      (res: Response) => res
    )
    .catch(
      this._errorHandler
    );
  }

  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }

}
