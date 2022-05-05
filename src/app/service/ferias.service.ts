import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';

@Injectable()
export class FeriasService {


  public PATH = "ferias/";   

  constructor(public http: HttpClient) { }

  getList(matricula) {
    return this.http.get(environment.baseUrl + this.PATH + matricula+"/"+"obterLista")
      .map((response: Response) => response)
      .catch(this._errorHandler);
  }



  downloadRelatorioAvisoFerias(id) {
    return this.http.get(environment.baseUrl + this.PATH + id + "/relatorioAviso", { responseType: "blob" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  atualizarSituacao(id) {
    return this.http.get(environment.baseUrl + this.PATH + id + "/atualizarSituacao")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  obterHistorico(id) {
    return this.http.get(environment.baseUrl + this.PATH + id + "/historico")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  downloadRelatorioReciboFerias(id) {
    return this.http.get(environment.baseUrl + this.PATH + id + "/relatorioReciboFerias", { responseType: "blob" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getSituacao() {
    return this.http.get(environment.baseUrl + this.PATH + "situacao")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  pesquisarFerias(obj) {
    return this.http.post(environment.baseUrl + this.PATH + "pesquisar", obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  downloadFrequenciasZip(path) {
    return this.http.post(environment.baseUrl + this.PATH + "gerarFilesZip", path, { responseType: "arraybuffer" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  clearFilesZip() {
    return this.http.get(environment.baseUrl + this.PATH + "clearFilesZip")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  _errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || "Internal server error");
  }

}
