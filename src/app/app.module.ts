import { AgmCoreModule } from '@agm/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatProgressBarModule, MatProgressSpinnerModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AdministrarPontoModule } from './administrar-ponto/administrar-ponto.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { BancoDeHorasModule } from './banco-de-horas/banco-de-horas.module';
import { ComponentsModule } from './components/components.module';
import { ConfirmEmailModule } from './confirm-email/confirm-email.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginModule } from './login/login.module';
import { RegistrarPontoModule } from './registrar-ponto/registrar-ponto.module';
import { AuthGuardService } from './service/auth-guard.service';
import { AuthorizationService } from './service/authorization.service';

import { InterceptorService } from './service/interceptor.service';
import { UserDataService } from './service/user-data.service';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DialogReprovarAbonoComponent } from './dialog/dialog-reprovar-abono/dialog-reprovar-abono.component';
import { TokenManagementService } from './service/token-management.service';




@NgModule({
  imports: [
    LoginModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    RegistrarPontoModule,
    AdministrarPontoModule,
    MatProgressSpinnerModule,
    BancoDeHorasModule,
    MatProgressBarModule,
    ConfirmEmailModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  exports:[
    MatProgressSpinnerModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    PrivacyPolicyComponent,
  ],
  providers: [AuthGuardService, TokenManagementService, UserDataService, AuthorizationService, {provide: LocationStrategy, useClass: HashLocationStrategy}
    ,{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
