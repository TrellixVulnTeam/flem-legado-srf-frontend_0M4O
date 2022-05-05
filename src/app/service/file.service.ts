import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileService {

  PATH: string = 'atestados/'
  constructor(private http: HttpClient) { }

  uploadAtestado(file: File, dataInicio, dataFim, matricula, atestado) {
    let formdata: FormData = new FormData();
    if (!file) {
      file = new File([], "");
    }
    formdata.append('file', file);
    formdata.append('dataInicio', dataInicio);
    formdata.append('dataFim', dataFim);
    formdata.append('matricula', matricula);
    formdata.append('atestado', JSON.stringify(atestado))
    const url = environment.baseUrl + this.PATH + "salva";
    return this._upload(url, formdata);
  }

  processar(atestado) {
    // console.log('teste');
    return this.http.put(environment.baseUrl + this.PATH + "simula", atestado)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  uploadFrequenciaAssinada(file: File, id) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('id', id);
    const url = environment.baseUrl + "frequencias/" + id + "/upload";
    return this._upload(url, formdata);
  }

  downloadFileAtestado(id) {
    const url = environment.baseUrl + "atestados/" + id + "/download";
    return this._download(url);
  }
 
  downloadFileFrequencia(id) {
    const url = environment.baseUrl + "frequencias/" + id + "/download";
    return this._download(url);
  }

  frequenciaJoinAtestadoJoinFerias(id) {
    const url = environment.baseUrl + "frequencias/" + id + "/joinDownload";
    return this._download(url);
  }

  // downloadFileExportacao(id) {
  //   const url = environment.baseUrl + "exportacaodominio/download/" + id;
  //   return this._download(url);
  // }

  downloadFileExportacao(id) {
    const url = environment.baseUrl + "exportacaodominio/download/exportacao/" + id;
    return this._download(url);
  }

  downloadFileDetalhamento(id) {
    const url = environment.baseUrl + "exportacaodominio/download/detalhamento/" + id;
    return this._download(url);
  }

  private _download(url, type?) {
    const tipoRetorno = type ? type : "blob";
    return this.http.get(url, { responseType: tipoRetorno })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  private _upload(url, formdata) {
    return this.http.post(url, formdata)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  
  uploadArquivoAbono(file: File, id) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);
    formdata.append('id', id);
    const url = environment.baseUrl + "abonos/" + id + "/upload";
    return this._upload(url, formdata);
  }


  private _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }


}
