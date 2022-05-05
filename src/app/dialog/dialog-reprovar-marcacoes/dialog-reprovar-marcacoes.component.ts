import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserDataService } from '../../service/user-data.service';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { MarcacoesService } from '../../service/marcacoes.service';
import { AlertType } from '../../model/alert-type';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { Marcacao } from '../../model/marcacao';

@Component({
  selector: 'app-dialog-reprovar-marcacoes',
  templateUrl: './dialog-reprovar-marcacoes.component.html',
  styleUrls: ['./dialog-reprovar-marcacoes.component.scss']
})
export class DialogReprovarMarcacoesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogReprovarMarcacoesComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private marcacoesService: MarcacoesService,
    private emitirEventoService: EmitirEventoService,
    private user: UserDataService) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  reprovar() {
    this.enviar(this.preencherMarcacoes());
  }

  preencherMarcacoes(): Marcacao {
    let marc = new Marcacao();
    if (this.data.marcacao && this.data.marcacao.id) {
      marc.id = this.data.marcacao.id;
      marc.dataMarcacao = this.data.dataDia + " " + this.data.marcacao.horaMarcacao;
      marc.observacao = this.data.observacao;
      marc.usuarioValidador = this.user.matricula();
      marc.usuarioAtualizacao = this.user.matricula();
    }
    return marc;
  }

  enviar(marcacao) {
    if (!marcacao.observacao) {
      HelperFrequencia.showNotification("Por favor preencha o campo observação!", AlertType.Error);
      return false;
    }
    this.marcacoesService.approveOrDisapprove(marcacao, "reprovada").subscribe(val => {
      HelperFrequencia.showNotification('Marcação reprovada com sucesso!', AlertType.Success);
      this.emitirEventoService.emitir("dialogReprovar", "dialogReprovar");
      this.onNoClick();
    }, error => {
      let msg = error.error.message;
      if (!msg) {
        msg = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(msg, AlertType.Error);
    });
  }


}
