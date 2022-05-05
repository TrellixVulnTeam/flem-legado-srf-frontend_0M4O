import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class RelatorioService {

  private _PATH = "relatorios/";

  constructor(public http: HttpClient) { }


  tipoDeRelatorio() {
    return this.http.get(environment.baseUrl + this._PATH + "tipoDeRelatorio")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  obterFrequenciasEnviadas(obj) {
    return this.http.post(environment.baseUrl + this._PATH + "mesAno", obj)
      .pipe(map((response: any) => response))
      .catch(this._errorHandler);
  }

  obterPendenciasRegistroFrequencia(obj) {
    return this.http.post(environment.baseUrl + this._PATH + "pendencia", obj)
      .pipe(map((response: any) => response))
      .catch(this._errorHandler);
  }

  obterDiasDeFaltas(obj) {
    return this.http.post(environment.baseUrl + this._PATH + "faltas", obj)
      .pipe(map((response: any) => response))
      .catch(this._errorHandler);
  }

  obterPrestacaoContas(obj) {
    return this.http.post(environment.baseUrl + this._PATH + "prestacao", obj)
      .pipe(map((response: any) => response))
      .catch(this._errorHandler);
  }


  obterListaDeAniversariantes(obj) {
    return this.http.post(environment.baseUrl + this._PATH + "aniversariantes", obj)
      .pipe(map((response: any) => response))
      .catch(this._errorHandler);
  }

  obterJustificativasPendentesValidacao(obj) {
    return this.http.post(environment.baseUrl + this._PATH + "justificativasPendentes", obj)
      .pipe(map((response: any) => response))
      .catch(this._errorHandler);
  }



  tiposDeJustificativas() {
    return this.http.get(environment.baseUrl + this._PATH + "tiposJustificativas")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  private _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }

}
