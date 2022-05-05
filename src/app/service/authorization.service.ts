import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';

@Injectable()
export class AuthorizationService {

  constructor(private userData: UserDataService) { }

  hasPermission(permissao): boolean {
    const permissions = this.userData.permissions();
    let has = false;
    if (permissions) {
      let tem = permissions.filter((item: any) => item.authority == permissao);
      if (tem.length) {
        has = true;
      }
    }
    return has;
  }

}
