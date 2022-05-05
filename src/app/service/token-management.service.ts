import { Injectable } from '@angular/core';

@Injectable()
export class TokenManagementService {

  constructor() { }

  private tokenKey: string = 'app_token';
  private tokenExpire: string = 'expires_in';

  public storeToken(content: Object) {
    localStorage.setItem(this.tokenKey, JSON.stringify(content));
  }
  public storeTokenExpire(tokenExpire) {
    const expired = this._getExpire(tokenExpire);
    localStorage.setItem(this.tokenExpire, ""+expired);
  }

  public retrieveToken() {
    return localStorage.getItem(this.tokenKey);
  }
  public retrieveTokenExpire() {
    return localStorage.getItem(this.tokenExpire);
  }

  public clear() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpire);
  }

  private _getExpire(tokenExpire):number {
    let dateExpiration = new Date();
    const minutos = dateExpiration.getSeconds() + tokenExpire;
    dateExpiration.setSeconds(minutos);
    return dateExpiration.getTime();
  }
  
  isExpired() {
    const dateExpiration = JSON.parse(localStorage.getItem(this.tokenExpire));
    return new Date().getTime() > dateExpiration;
  }

}
