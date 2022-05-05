import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class BancoDeHorasService {

  PATH = "bancodehoras/";

  constructor(public http: HttpClient) { }

  projetos() {

    return this.http.get(environment.baseUrl + this.PATH + "/bancodehoras")
      .map(
        (res: Response) => res
      )
      .catch(
        this._errorHandler
      );
  }

  projetosInternos() {

    return this.http.get(environment.baseUrl + this.PATH + "/projetosinternos")
      .map(
        (res: Response) => res
      )
      .catch(
        this._errorHandler
      );
  }

  projetosExternos() {

    return this.http.get(environment.baseUrl + this.PATH + "/projetosexternos")
      .map(
        (res: Response) => res
      )
      .catch(
        this._errorHandler
      );
  }

  funcionariosPorProjeto(id) {
    return this.http.get(environment.baseUrl + this.PATH + "/bancodehoras/" + id + "/funcionarios")
      .map(
        (res: Response) => res
      )
      .catch(
        this._errorHandler
      );
  }

  funcionariosPorProjetos(ids) {
    return this.http.get(environment.baseUrl + this.PATH + "/bancodehoras/" + ids + "/funcionarios")
      .map(
        (res: Response) => res
      )
      .catch(
        this._errorHandler
      );
  }

  downloadPDF(ids) {
    return this.http.get(environment.baseUrl + this.PATH + "/printPDF/" + ids, { responseType: "blob" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  downloadRelatorioBancoHorasindividual(obj) {
    return this.http.post(environment.baseUrl + this.PATH + "pdfIndividual" , obj, { responseType: "blob" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  obterBancoHoras(ids) {
    return this.http.post(environment.baseUrl + this.PATH + "obterBancoHoras", ids)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  downloadRelatorioBancoHorasindividualMensal(obj) {
    return this.http.post(environment.baseUrl + this.PATH + "pdfIndividualMensal" , obj, { responseType: "blob" })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }


}