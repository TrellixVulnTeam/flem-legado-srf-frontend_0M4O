import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { stringify } from 'querystring';

@Injectable()
export class DadosFuncionarioService {
  

  constructor(public http: HttpClient) { }
  public PATH = 'dadosFuncionario/';   

  _errorHandler(error: Response) {
    return Observable.throw(error || 'Internal server error');
  }

  uploadComprovanteEndereco(funcionario, file: File) {
    let formdata: FormData = new FormData();
    if (file) {
      formdata.append('file', file);
    }
    formdata.append('dadosFuncionario', JSON.stringify(funcionario));
    const url =  environment.baseUrl + this.PATH;
    return this._upload(url, formdata);
  }

  private _upload(url, formdata) {
    return this.http.post(url, formdata)
      .map((response: any) => response)
      .catch(this._errorHandler);
  }
  pesquisarDadosAlterados(obj: any) {
    return this.http.post(environment.baseUrl + this.PATH + 'funcionariosPendencias', obj)
    .map((response: any) => response)
    .catch(this._errorHandler);
  }

  
  downloadFile(id) {
    const url = environment.baseUrl + this.PATH + id + '/downloadComprovanteEndereco';
    return this._download(url);
  }

  private _download(url, type?) {
    const tipoRetorno = type ? type : 'blob';
    return this.http.get(url, { responseType: tipoRetorno })
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  obterHistorico(id: any): any {
    return this.http.get(environment.baseUrl + this.PATH + id + '/historico')
    .map((response: any) => response)
    .catch(this._errorHandler);
  }

  getSituacao() {
    return this.http.get(environment.baseUrl + this.PATH + 'situacoes')
      .map((response: any) => response)
      .catch(this._errorHandler);
  }

  aprovar(id: any) : Observable<any[]> {
    return this.http.put(environment.baseUrl + this.PATH +id+ '/aprovacao',null)
    .map((response: any) => response)
    .catch(this._errorHandler);
  }

  reprovar(obj: any) : Observable<any[]>{
    if (obj.observacao) {
      obj.descricao = obj.observacao;
    }
    return this.http.put(environment.baseUrl + this.PATH +'reprovacao',obj)
    .map((response: any) => response)
    .catch(this._errorHandler);
  }
}
