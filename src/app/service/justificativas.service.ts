import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from 'environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable()
export class JustificativasService {

  PATH = "justificativas";

  constructor(public http: HttpClient) { }

  get(id:any){
    return this.http.get(environment.baseUrl+this.PATH+"/"+id)
      .pipe(map(
        (res: Response) => res
      ))
      .catch(
        this._errorHandler
      );
  }

  save(Justificativa){
    return this.http.post(environment.baseUrl+this.PATH ,(Justificativa))
      .pipe(map((response: Response) => HttpErrorResponse))
      .catch(this._errorHandler);
  }

  update(Justificativa){
    return this.http.put(environment.baseUrl+this.PATH ,(Justificativa))
    .pipe(map((response: Response) => response))
    .catch(this._errorHandler);
  }
  
  delete(id){
    return this.http.delete(environment.baseUrl+this.PATH+"/"+id)
    .pipe(map((response: Response) => response))
    .catch(this._errorHandler);
  }

  getJustificativas() {
    return this.http.get(environment.baseUrl + this.PATH+"/lista")
      .pipe(map((response: any) => response ))
      .catch(this._errorHandler);
  }

  
  comboJustificativa() {
    return this.http.get(environment.baseUrl + this.PATH+"/comboJustificativa")
      .pipe(map((response: any) => response ))
      .catch(this._errorHandler);
  }

  getTiposJustificativas() {
    return this.http.get(environment.baseUrl + this.PATH+"/tipos")
      .pipe(map((response: any) => response ))
      .catch(this._errorHandler);
  }

  _errorHandler(error: Response) {
    return Observable.throw(error || "Internal server error");
  }

}
