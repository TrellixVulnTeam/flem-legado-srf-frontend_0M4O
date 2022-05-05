import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { take } from 'rxjs/operators';
import { FrequenciaService } from 'app/service/frequencia.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { Observable } from 'rxjs';
import { ReprovacoesService } from 'app/service/reprovacoes.service';

@Component({
  selector: 'app-dialog-confirm-frequencias',
  templateUrl: './dialog-confirm-frequencias.component.html',
  styleUrls: ['./dialog-confirm-frequencias.component.scss']
})
export class DialogConfirmFrequenciasComponent implements OnInit {

  tiposReprovacao$: Observable<any[]>;

  constructor(public _dialogRef: MatDialogRef<DialogConfirmFrequenciasComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _frequeciaService: FrequenciaService,
    private _emitirEventoService: EmitirEventoService,
    private _reprovacaoService: ReprovacoesService) { }

  tipoTitulo: string;
  tipoMotivo: string;
  tipoReprovacao: any;

  ngOnInit() {
    this.tipoTitulo = this.titulo();
    this.comboTiposReprovacao();
  }

  titulo(): string {
    if (this.data.reprovar) {
      return "Reprovar";
    } else {
      return "Reabrir";
    }
  }


  onNoClick(): void {
    this._dialogRef.close();
  }



  reprovar() {
    let mensagem: string = this.validarcampos();
    if (mensagem != "") {
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
      return false;
    } else {
      this.reprovarFrequencia();
    }
  }

  reabrir() {
    let mensagem: string = this.validarcampos();
    if (mensagem != "") {
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
      return false;
    } else {
      this.reabrirFrequencia();
    }
  }


  reprovarFrequencia(): void {
    this._frequeciaService.reprovarFrequencia(this.obj()).pipe(take(1)).subscribe(obj => {
      HelperFrequencia.showNotification("Frequência reprovada com sucesso.", AlertType.Success);
      this._emitirEventoService.emitir("reprovar", "reprovar");
      this.onNoClick();
    }, erro => {
      let mensagem = erro.error.message;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }


  reabrirFrequencia(): void {

    this._frequeciaService.reabrirFrequencia(this.obj()).pipe(take(1)).subscribe(obj => {
      HelperFrequencia.showNotification("Frequência reaberta com sucesso.", AlertType.Success);
      this._emitirEventoService.emitir("reabrir", "reabrir");
      this.onNoClick();
    }, erro => {
      console.log(erro);
      let mensagem = erro.error.message;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }



  validarcampos(): string {
    if (this.data.reprovar) {
      if (!this.tipoReprovacao) {
        return "Por favor preencha o campo tipo Tipo de Reprovação";
      }
    }
    if (!this.data.obj.observacao) {
      return "Por favor preencha o campo observação!";
    }
    return "";

  }

  obj() {
    let obj = {
      idFrequencia: this.data.obj.id,
      observacao: this.data.obj.observacao,
      aprovado: false,
      filePath: this.data.obj.filePath,
      reprovacao: this.tipoReprovacao
    }
    return obj;
  }

  comboTiposReprovacao() {
    this.tiposReprovacao$ = this._reprovacaoService.getListaReprovacoes();
  }


}
