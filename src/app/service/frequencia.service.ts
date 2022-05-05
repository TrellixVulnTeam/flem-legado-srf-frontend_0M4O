import { Injectable } from '@angular/core';
import { Http, Response, ResponseType } from '@angular/http';
import { Constante } from '../model/constants';

import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { UserDataService } from './user-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class FrequenciaService {

  PATH = "frequencias/";

  constructor(public http: HttpClient, private userService: UserDataService) { }

  time() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'none',
      })
    };
    return this.http.get(environment.baseUrl + this.PATH + "time", httpOptions);
  }
  get(matricula, ano, mes) {
    return this.http.get(environment.baseUrl + this.PATH + matricula + "/" + ano + "/" + mes);
  }

  save(frequencias) {
    return this.http.post(environment.baseUrl + this.PATH, frequencias);
  }

  update(frequencias) {
    return this.http.put(environment.baseUrl + this.PATH, frequencias)
  }

  registrarPontoEmAtraso(frequencias, matricula) {
    return this.http.post(environment.baseUrl + this.PATH + "emAtraso/" + matricula, frequencias)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  gerar(matricula, ano, mes) {
    return this.http.post(environment.baseUrl + this.PATH, { matricula: matricula, ano: ano, mes: mes })
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  movimentos() {
    return this.http.get(environment.baseUrl + this.PATH + "movimentos")
      .map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  downloadPDF(idFrequencia) {
    return this.http.get(environment.baseUrl + this.PATH + "printPDF/" + idFrequencia, { responseType: "blob" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  downloadAnexo(idFrequencia) {
    return this.http.get(environment.baseUrl + this.PATH + "file/" + idFrequencia, { responseType: "blob" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  downloadAnexoAbono(idAnexo) {
    return this.http.get(environment.baseUrl + "atestados/file/" + idAnexo, { responseType: "blob" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  registrarPonto(nome, senha, horario, lat, lng) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'none',
      })
    };
    return this.http.post(environment.baseUrl + this.PATH, { username: nome, senha: senha, dataMarcacao: horario, latitude: lat, longitude: lng }, httpOptions)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getFrequencias(matricula) {
    return this.http.get(environment.baseUrl + this.PATH + "matricula/" + matricula)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getDiasByFrequencia(frequencia) {
    return this.http.get(environment.baseUrl + this.PATH + frequencia + "/dias")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getFileName(id) {
    return this.http.get(environment.baseUrl + this.PATH + "fileName/" + id, { responseType: 'text' })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  validarFrequencia(id) {
    console.log(environment.baseUrl + this.PATH + "validar", id)
    return this.http.put(environment.baseUrl + this.PATH + "validar", id)
      .map((response: any) => response);
  }

  getFrequenciasById(id) {
    return this.http.get(environment.baseUrl + this.PATH + id)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  disponiblizarFolha(id) {
    return this.http.post(environment.baseUrl + this.PATH + "disponibilizar", id)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  obterListaSituacaoEnvioFrequencia(mesAno, listaProjeto) {
    return this.http.post(environment.baseUrl + this.PATH + "mesAno/" + mesAno, listaProjeto)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  obterListaDeQuemNuncaAcessouSistema(mesAno, listaProjeto) {
    return this.http.post(environment.baseUrl + this.PATH + "nuncaAcessou/" + mesAno, listaProjeto)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  getSituacaoFrequencia() {
    return this.http.get(environment.baseUrl + this.PATH + "statusFrquencia")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getFrequenciasParaValidacao(filtro) {
    return this.http.post(environment.baseUrl + this.PATH + "obterFrequencias", filtro)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  downloadFilesZip(mesAno) {
    return this.http.get(environment.baseUrl + this.PATH + mesAno + "/filesZip", { responseType: "blob" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  reprovarFrequencia(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "reprovarFrequencia", obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  reabrirFrequencia(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "reabrirFrequencia", obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getHistory(id) {
    return this.http.get(environment.baseUrl + this.PATH + id + "/historico")
      .map((res: any) => res)
      .catch(this._errorHandler);
  }

  salvarObservacaoPontoFocal(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "observacaoPontoFocal", obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  getObservacaoNaoAssinada(id) {
    return this.http.get(environment.baseUrl + this.PATH + id + "/observacaoNaoAssinatura")
      .map((res: any) => res)
      .catch(this._errorHandler);
  }

  obterDemandante(id) {
    return this.http.get(environment.baseUrl + this.PATH +id+ "/obterDemandante")
      .map((res: any) => res)
      .catch(this._errorHandler);
  }

  obterMuniciopio() {
    return this.http.get(environment.baseUrl + this.PATH +"obterMuniciopio")
      .map((res: any) => res)
      .catch(this._errorHandler);
  }

  downloadFrequenciasZip(matricula) {
    return this.http.post(environment.baseUrl + this.PATH + "downloadZip", matricula, { responseType: "arraybuffer" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

   clearFilesZip() {
    return this.http.get(environment.baseUrl + this.PATH + "clearFilesZip")
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }

}
