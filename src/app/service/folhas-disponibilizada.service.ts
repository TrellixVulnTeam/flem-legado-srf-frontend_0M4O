import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDataService } from './user-data.service';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class FolhasDisponibilizadaService {

  PATH = "frequenciaDisponibilizada/";

  constructor(public http: HttpClient, private userService: UserDataService) { }

  obterFrequenciasDisponibilizadas(obj) {
    return this.http.post(environment.baseUrl + this.PATH + "obterFrequencias", obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }


  validarFrequenciaDisponibilizada(obj) {
    return this.http.put(environment.baseUrl + this.PATH + "validar", obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  gerarFilesZip(obj) {
    return this.http.post(environment.baseUrl + this.PATH + "gerarFilesZip", obj)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  downloadFilesZip(obj) {
    return this.http.post(environment.baseUrl + this.PATH + "downloadFilesZip", obj, { responseType: "arraybuffer" })
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
