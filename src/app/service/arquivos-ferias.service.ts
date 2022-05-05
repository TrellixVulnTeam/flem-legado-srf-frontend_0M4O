import { Injectable, ɵConsole } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';

@Injectable()
export class ArquivosFeriasService {

  public PATH = "arquivosFerias/";

  constructor(public http: HttpClient) { }

  getListArquivos(id) {
    return this.http.get(environment.baseUrl + this.PATH + id)
      .map((response: Response) => response)
      .catch(this._errorHandler);
  }

  private _upload(url, formdata) {
    return this.http.post(url, formdata)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  uploadAviso(file: File, obj) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('tipo', obj.tipo);
    formdata.append('id', obj.id);
    formdata.append('dtInicio', obj.dtInicio);
    formdata.append('dtFim', obj.dtFim);
    formdata.append('matricula', obj.matricula);
    const url = environment.baseUrl + this.PATH + "upload";
    return this._upload(url, formdata);
  }

  getListTiposArquivos(id) {
    return this.http.get(environment.baseUrl + this.PATH + id + "/tipo")
      .map((response: Response) => response)
      .catch(this._errorHandler);
  }


  downloadAnexo(id, tipo) {
    return this.http.get(environment.baseUrl + this.PATH + id + "/" + tipo + "/download", { responseType: "blob" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  ziparArquivos(id) {
    return this.http.post(environment.baseUrl + this.PATH + id + "/zip", { responseType: "json" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  downloadFilesZip(path) {
    return this.http.post(environment.baseUrl + this.PATH + "downloadZip", path, { responseType: "arraybuffer" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  clearFilesZip(pasta) {
    return this.http.get(environment.baseUrl + this.PATH + pasta + "/clearFilesZip")
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


  uploadComprovantesferias(file: File) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    const url = environment.baseUrl + this.PATH + "uploadComprovante";
    return this._upload(url, formdata);
  }

  _errorHandler(error: Response) {
    console.log(error);
    return Observable.throw(error || "Internal server error");
  }


}
