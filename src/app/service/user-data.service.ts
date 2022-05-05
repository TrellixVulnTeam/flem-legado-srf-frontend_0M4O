import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class UserDataService {

  autenticadoEmitter = new EventEmitter<boolean>();

  constructor() { }

  storeUser(user): void {
    localStorage.setItem('currentuser', JSON.stringify(user));
    this.autenticadoEmitter.emit(true);
  };

  logout(): void {
    localStorage.removeItem('currentuser');
    this.autenticadoEmitter.emit(false);
  };

  getCurrentUser() {
    const user = localStorage.getItem("currentuser");
    return JSON.parse(user);
  }
  /**
   * verifica se usuário logado tem determinada permissão
   * @param permissao 
   */
  hasPermission(permissao): boolean {
    const user = this.getCurrentUser();
    let has = false;
    if (user) {
      const permission = this.permissions();
      if (permission) {
        let tem = permission.filter((item: any) => item.authority == permissao);
        if (tem.length) {
          has = true;
        }
      }
    }
    return has;
  }

  matricula() {
    const user = this.getCurrentUser();
    if (user)
      return Number(user.matricula);
    return;
  }

  userId() {
    const user = this.getCurrentUser();
    if (user)
      return Number(user.idUser);
    return;
  }

  userName() {
    const user = this.getCurrentUser();
    if (user) {
      return String(user.nome);
    }
    return;
  }
  /**
   * Obtem as permissões do usuário logado
   */
  permissions(): Array<string> {
    const user = this.getCurrentUser();
    if (user) {
      return user.authorities;
    }
    return;
  }
  
  lotacaoDominio() {
    const user = this.getCurrentUser();
    if (user)
      return Number(user.lotacaoDominio);
    return;
  }
}
