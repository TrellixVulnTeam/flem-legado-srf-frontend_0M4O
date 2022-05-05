import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { tap } from 'rxjs/operators';
import { TokenManagementService } from './token-management.service';

@Injectable()
export class AutenticacaoService {

  private _urlToken = environment.urlToken;
  private _urlUser = environment.urlUser;

  constructor(private http: HttpClient, private _tokenService: TokenManagementService) { }

  login(login, senha) {
    const user = { grant_type: "password", username: login, password: senha }
    let headers = new HttpHeaders({ 'Accept': 'application/json', 'Authorization': 'Basic ' + btoa("srfapp:$2a$10$p9Pk0fQNAQSesI4vuvKA0OZanDD2") });
    return this.http.post(this._urlToken, {}, { headers: headers, params: user })
      .pipe(
        tap((user: any) => user)
      )
  }

  /**
* 
*/
  user() {
    return this.http.get(this._urlUser)
      .pipe(
        tap((user: any) => user)
      );
  }

  logout() {
    this._tokenService.clear();
  }

}
