import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AutenticacaoService } from '../service/autenticacao.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperFrequencia } from '../helper/helper-frequencia';
import { AlertType } from '../model/alert-type';
import { TokenManagementService } from 'app/service/token-management.service';
import { UserDataService } from 'app/service/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  newForm: FormGroup;
  loading = false;
  returnUrl: string;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private _tokenService: TokenManagementService, private _userData: UserDataService,
    private autenticacaoService: AutenticacaoService) { }

  ngOnInit() {
    this.buildForm();
    this.autenticacaoService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  autenticar() {
    if (!this.newForm.valid) {
      HelperFrequencia.showNotification("Todos os campos são obrigatórios", AlertType.Warning);
      return;
    }
    this.loading = true;
    this.autenticacaoService.login(this.newForm.value.login, this.newForm.value.password)
      .subscribe(
        data => {
          this._storeToken(data);
          this._storeUser();
        },
        error => {
          HelperFrequencia.showNotification(error.error.message, AlertType.Error);
        }, () => {
          this.loading = false;
        });
  }

  private _storeToken(user) {
    this._tokenService.storeToken(user.access_token);
    this._tokenService.storeTokenExpire(user.expires_in);
  }

  private _storeUser() {
    this.autenticacaoService.user().subscribe(user => {
      this._userData.storeUser(user.userAuthentication);
      this.router.navigate([this.returnUrl]);
    })
  }

  baterPonto() {
    this.router.navigate(['registrar-ponto']);
  }

  buildForm() {

    this.newForm = new FormGroup({
      'login': new FormControl('', Validators.compose([Validators.required])),
      'password': new FormControl('', Validators.compose([Validators.required])),
    });
  }

}
