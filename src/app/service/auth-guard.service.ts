import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserDataService } from './user-data.service';
import { AuthorizationService } from './authorization.service';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { TokenManagementService } from './token-management.service';

@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(public auth: TokenManagementService, public router: Router, protected authorizationService: AuthorizationService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if ( !this.auth.retrieveToken() || this.auth.isExpired() ) {
      HelperFrequencia.showNotification("Sessão Expirada!", AlertType.Warning);
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
    }
    
    if ( route.data ){
      const role = route.data['role'];
      if( !this.hasRequiredPermission(role) ){
        this.router.navigate(['/access']);
        return false;
      }
    }
    return true;
  }
  protected hasRequiredPermission(permissao: string): boolean {
    return this.authorizationService.hasPermission(permissao);
  }

}
