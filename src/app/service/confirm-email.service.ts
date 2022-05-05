import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class ConfirmEmailService {

  path = "funcionariolocal/"

  constructor(private http: HttpClient) { }

  confirmarEmail(token){
    return this.http.put(environment.baseUrl+this.path+"confirmaremail/"+token, {});
  }
}
