import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../dialog-confirm/dialog-confirm.component';
import { FolhasDisponibilizadaService } from '../../service/folhas-disponibilizada.service';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { take } from 'rxjs/operators';
import { AlertType } from '../../model/alert-type';
import { HelperFrequencia } from '../../helper/helper-frequencia';

@Component({
  selector: 'app-dialog-confirm-frequencia-disponibilizada',
  templateUrl: './dialog-confirm-frequencia-disponibilizada.component.html',
  styleUrls: ['./dialog-confirm-frequencia-disponibilizada.component.scss']
})
export class DialogConfirmFrequenciaDisponibilizadaComponent implements OnInit {


  constructor(public _dialogRef: MatDialogRef<DialogConfirmFrequenciaDisponibilizadaComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _folhasDisponibilizadasService: FolhasDisponibilizadaService,
    private _emitirEventoService: EmitirEventoService) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this._dialogRef.close();
  }



  reprovar() {
    if (!this.data.obj.observacao) {
      HelperFrequencia.showNotification("Por favor preencha o campo observação!", AlertType.Error);
      return false;
    } else {
      this.validarFrequenciaDisponibilizada();
    }

  }

  validarFrequenciaDisponibilizada(): void {
    this.data.obj.aprovado = false;
    this._folhasDisponibilizadasService.validarFrequenciaDisponibilizada(this.data.obj).pipe(take(1)).subscribe(obj => {
      HelperFrequencia.showNotification("Frequência reprovada com sucesso.", AlertType.Success);
      this._emitirEventoService.emitir("reprovar", "reprovar");
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
}
