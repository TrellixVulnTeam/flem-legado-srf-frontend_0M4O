import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs';

@Injectable()
export class ExportarDominioService {

  PATH = "exportacaodominio/";

  constructor(public http: HttpClient) { }

  exportarArquivoDominio(idArquivo) {
    return this.http.get(environment.baseUrl + this.PATH + 'download/' + idArquivo);
  }

  get(matricula, ano, mes) {
    return this.http.get(environment.baseUrl + this.PATH + matricula + "/" + ano + "/" + mes);
  }

  getListExportacoes() {
    return this.http.get(environment.baseUrl + this.PATH + "lista")
      .pipe(map((response: any) => response))
      .catch(this._errorHandler);
  }

  save(exportacaoDominio) {
    return this.http.post(environment.baseUrl + this.PATH, exportacaoDominio);
  }

  regularizacaoFaltas(id) {
    return this.http.get(environment.baseUrl + this.PATH + "regularizacaofaltas/" + id);
  }

  pagamentoFaltasRegularizadas(obj) {
    console.log(obj.competencia.replace('/', '_'));
    return this.http.get(environment.baseUrl + this.PATH + "pagamentofaltasregularizadas/" + obj.id + "/" + obj.competencia.replace('/', ''));
  }

  dsrFaltas(id) {
    return this.http.get(environment.baseUrl + this.PATH + "dsrfaltas/" + id);
  }

  regularizacaoDsrFaltas(id) {
    return this.http.get(environment.baseUrl + this.PATH + "regularizacaoDsrfaltas/" + id);
  }

  pagamentoRegularizacaoDsrFaltas(id) {
    return this.http.get(environment.baseUrl + this.PATH + "pagamentoregularizacaodsrfaltas/" + id);
  }

  delete(id) {
    return this.http.delete(environment.baseUrl + this.PATH + "/excluirPermanente/" + id)
      .pipe(map((response: Response) => response))
      .catch(this._errorHandler);
  }

  update(exportacaoDominio) {
    return this.http.put(environment.baseUrl + this.PATH, exportacaoDominio);
  }

  getHistory() {
    return this.http.get(environment.baseUrl + 'historico_exportar')
      .pipe(map((response: Response) => response))
      .catch(this._errorHandler);
  }


  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }

}
