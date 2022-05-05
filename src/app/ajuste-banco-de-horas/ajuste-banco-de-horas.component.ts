import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmitirEventoService } from '../service/emitir-evento.service';
import { FrequenciaService } from '../service/frequencia.service';
import { UserDataService } from '../service/user-data.service';
import { AjusteService } from '../service/ajuste.service';
import { HelperFrequencia } from '../helper/helper-frequencia';
import { AlertType } from '../model/alert-type';

@Component({
  selector: 'app-ajuste-banco-de-horas',
  templateUrl: './ajuste-banco-de-horas.component.html',
  styleUrls: ['./ajuste-banco-de-horas.component.scss']
})

export class AjusteBancoDeHorasComponent implements OnInit {

  tpAjustes = ["Saldo Inicial",'Horas a pagar',"Outros"];
  newForm: FormGroup;
  funcionario = {} as any;
  frequenciaList$;
  public maskTime = [/\d/, /\d/, /\d/, ':', /\d/, /\d/];


  constructor(private emitirEventoService: EmitirEventoService,
    private frequenciaService: FrequenciaService,
    private user: UserDataService,
    private ajusteService: AjusteService) { }

  ngOnInit() {
    this.emitirEventoService.mensagem.subscribe(obj => {
      if (obj && obj.type === 'funcionario') {
        this.frequencias(obj.data.codigoDominio);
      }
    });
    this.buildForm();
  }


  buildForm(): void {
    this.newForm = new FormGroup({
      'check': new FormControl(''),
      'hora': new FormControl('', Validators.required),
      'tipo': new FormControl('', Validators.required),
      'observacao': new FormControl('', Validators.required),
      'frequencia': new FormControl('', Validators.required)
    });
  }


  frequencias(matricula) {
    this.frequenciaList$ = this.frequenciaService.getFrequencias(matricula);
  }

  salvar(): void {
    if (this.validarCampos()) {
      let frequencia = this.newForm.controls['frequencia'].value;
      let ajuste = {
        valor: 0,
        valorEmHoras: this.newForm.controls['hora'].value,
        motivo: this.newForm.controls['observacao'].value,
        checked: this.newForm.controls['check'].value,
        tipo: this.newForm.controls['tipo'].value,
        matricula: this.user.matricula(),
        idFrequencia: frequencia.id
      };
      this.ajusteService.salvar(ajuste).subscribe(obj => {
        HelperFrequencia.showNotification('Ajuste salvo com sucesso.', AlertType.Success)
        this.newForm.reset();
      }, erro => {
        HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      });
    }

  }

  validarCampos(): boolean {
    if (this.newForm.controls['tipo'].value == '') {
      HelperFrequencia.showNotification('Por favor preencha o campo Tipo de Ajuste de Hora', AlertType.Error);
      return false;
    } else if (this.newForm.controls['frequencia'].value == '') {
      HelperFrequencia.showNotification('Por favor selecione o Mês da Frequência', AlertType.Error);
      return false;
    } else if (this.newForm.controls['hora'].value=='') {
      HelperFrequencia.showNotification('Por favor preencha o campo Horas', AlertType.Error);
      return false;
    } else if (this.newForm.controls['check'].value == '') {
      HelperFrequencia.showNotification('Por favor selecione se ajuste vai ser positivo ou negativo', AlertType.Error);
      return false;
    } else {
      return true;
    }
  }


}
