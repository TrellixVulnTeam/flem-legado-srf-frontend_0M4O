import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HorarioTrabalhoService {

  PATH = "jornadaTrabalho/";

  constructor(public http: HttpClient) { }

  obterJornada(matricula) {
    return this.http.get(environment.baseUrl + this.PATH + matricula + "/obterJornada")
      .map((res: any) => res)
      .catch(this._errorHandler);
  }

  uploadHorasTrabalho(matricula, file: File) {
    let formdata: FormData = new FormData();
    if (!file) {
      file = new File([], "");
    }
    formdata.append('file', file);
    formdata.append('matricula', matricula);
    const url = environment.baseUrl + this.PATH + "salva";
    return this._upload(url, formdata);
  }

  private _upload(url, formdata) {
    return this.http.post(url, formdata)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getSituacao() {
    return this.http.get(environment.baseUrl + this.PATH + "situacao")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  pesquisarHorarios(obj) {
    return this.http.post(environment.baseUrl + this.PATH + "pesquisar", obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  downloadFile(id) {
    const url = environment.baseUrl + this.PATH + id + "/download";
    return this._download(url);
  }

  private _download(url, type?) {
    const tipoRetorno = type ? type : "blob";
    return this.http.get(url, { responseType: tipoRetorno })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  reprovar(obj) {
    return this.http.post(environment.baseUrl + this.PATH + "reprovar", obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  aprovar(id) {
    return this.http.post(environment.baseUrl + this.PATH + "aprovar", id)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  obterHistorico(id) {
    return this.http.get(environment.baseUrl + this.PATH + id + "/historico")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }
}
