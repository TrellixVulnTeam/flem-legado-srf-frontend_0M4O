import { Injectable } from '@angular/core';
import { HttpHandler, HttpRequest, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { TokenManagementService } from './token-management.service';
import { tap, catchError } from 'rxjs/operators';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { of } from 'rxjs/observable/of';
import { AlertType } from 'app/model/alert-type';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(private _tokenService: TokenManagementService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this._tokenService.retrieveToken();
    if (token) {
      const authReq = req.clone({
        headers: new HttpHeaders({
          'Authorization': 'bearer ' + JSON.parse(token),
          'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        })
      });
      return this._intercept(authReq, next);
    }
    return this._intercept(req, next);
  }

  private _intercept(req: HttpRequest<any>, next: HttpHandler) {

    return next.handle(req).pipe(
      tap(evt =>{evt;}),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          try {
            if (!err.status) {
              HelperFrequencia.showNotification('O Serviço está indisponível. Entre em contato com o NTI!',  AlertType.Error);
            } else if (err.status === 401) {
              HelperFrequencia.showNotification('Faça o login para acessar este recurso!',  AlertType.Error);
            } else if (err.error.message) {
              HelperFrequencia.showNotification(err.error.message,  AlertType.Error);
            }
          } catch (e) {
            HelperFrequencia.showNotification("Erro ao carregar a aplicação",  AlertType.Error);
          }
        }
        return of(err);
      }));
  }

  // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return this.handleAccess(request, next);
  // }

  // private handleAccess(request: HttpRequest<any>, next: HttpHandler):
  //   Observable<HttpEvent<any>> {
  //   const idUser = this.userDataService.idUser();
  //   const lotacaoDominio = this.userDataService.lotacaoDominio();
  //   let changedRequest = request;

  //   const headerSettings: { [name: string]: string | string[]; } = {};
  //   for (const key of request.headers.keys()) {
  //     headerSettings[key] = request.headers.getAll(key);
  //   }

  //   if (idUser) {
  //     headerSettings['idUser'] = idUser + "";
  //   }

  //   if (lotacaoDominio) {
  //     headerSettings['lotacaoDominio'] = lotacaoDominio + "";
  //   }

  //   const newHeader = new HttpHeaders(headerSettings);

  //   changedRequest = request.clone({ headers: newHeader });
  //   return next.handle(changedRequest).map(event => {

  //     if (event instanceof HttpResponse) {
  //       event = event.clone({ body: event.body })
  //       if (event.status == 200) {
  //         const timeSession = this.userDataService.getTimeSession();
  //         if (timeSession) {
  //           this.userDataService.setTime(timeSession);
  //         }
  //       }
  //     }
  //     return event;
  //   });
  // }

}
