import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ComunicacaoService {

  PATH = "comunicacao";

  constructor(public http: HttpClient) { }

  image(): Observable<Blob>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'none'      
    });
    return this.http.get<Blob>(environment.baseUrl + this.PATH, {headers: headers, responseType: 'blob' as 'json'} )
      .map((res: any) => res);
  }

}
