import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { FuncionarioService } from 'app/service/funcionario.service';
import { FuncionariolocalService } from 'app/service/funcionariolocal.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-configurar',
  templateUrl: './configurar-funcionario.component.html',
  styleUrls: ['./configurar-funcionario.component.scss']
})
export class ConfigurarFuncionarioComponent implements OnInit {

  public funcionario = {} as any;
  public matricula: any;
  public pageIndex: any;
  public formNew: FormGroup;

  constructor(private _funcionarioService: FuncionarioService,
    private _service: FuncionariolocalService,
    private _avRoute: ActivatedRoute,
    private _router: Router) { }

  ngOnInit() {
    this._params();
    this._buildForm();
  }

  private _params(): void {
    if (this._avRoute.snapshot.params["matricula"]) {
      this.matricula = this._avRoute.snapshot.params["matricula"];
      this.obterDadosFuncionario(this.matricula);
    }
    if (this._avRoute.snapshot.queryParamMap.get("pageIndex")) {
      this.pageIndex = this._avRoute.snapshot.queryParamMap.get("pageIndex");
    }
  }

  private _buildForm(): void {
    this.formNew = new FormGroup({
      'registraFrequencia': new FormControl(''),
      'emailAvisoFerias': new FormControl(''),
      'emailFalta': new FormControl(''),
      'emailInconsistencia': new FormControl(''),
      'emailFrequencia': new FormControl(''),
      'emailDocumentoFerias': new FormControl(''),
    });
  }


  obterDadosFuncionario(matricula) {
    this._funcionarioService.getBy(matricula, "matricula").subscribe(map => {
      //console.log(map)
      if (map) {
        this.funcionario = map;
        this.funcionario.codigoDominio = map.matricula;
      }
      this.obterDadosFuncionarioLocal(matricula);
    }, erros => {
      this.funcionario = {} as any;
      let msg = "Nenhum funcionário encontrado";
      if (erros.error.message) {
        msg = erros.error.message;
      }
      HelperFrequencia.showNotification(msg, AlertType.Error);
    });

  }

  obterDadosFuncionarioLocal(matricula) {
    this._service.getFuncionarioDTO(matricula).subscribe(map => {
      // console.log(map)
      this.formNew.controls['registraFrequencia'].patchValue(map.registraFrequencia);
      this.formNew.controls['emailAvisoFerias'].patchValue(map.emailAvisoFerias);
      this.formNew.controls['emailDocumentoFerias'].patchValue(map.emailDocumentoFerias);
      this.formNew.controls['emailFalta'].patchValue(map.emailFalta)
      this.formNew.controls['emailInconsistencia'].patchValue(map.emailInconsistencia);
      this.formNew.controls['emailFrequencia'].patchValue(map.emailFrequencia);
    }, erros => {
      HelperFrequencia.showNotification(erros.error.message, AlertType.Error);
    });

  }



  cancelar() {
    this._router.navigate(['funcionarios/'], {
      queryParams: {
        pageIndex: this.pageIndex,
      },
      skipLocationChange: true
    });
  }

  salvar() {
    // console.log(this.obj());
    this._service.atualizarConfiguracao(this.obj()).pipe(take(1)).subscribe(item => {
      HelperFrequencia.showNotification(item.value, AlertType.Success);
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }

  obj() {
    return {
      matricula: this.matricula,
      registraFrequencia: this.formNew.controls['registraFrequencia'].value,
      emailAvisoFerias: this.formNew.controls['emailAvisoFerias'].value,
      emailDocumentoFerias: this.formNew.controls['emailDocumentoFerias'].value,
      emailFalta: this.formNew.controls['emailFalta'].value,
      emailInconsistencia: this.formNew.controls['emailInconsistencia'].value,
      emailFrequencia: this.formNew.controls['emailFrequencia'].value,
    }
  }


}
