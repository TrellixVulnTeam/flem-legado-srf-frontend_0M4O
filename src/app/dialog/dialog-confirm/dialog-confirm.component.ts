import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { MarcacoesService } from '../../service/marcacoes.service';
import { EmitirEventoService } from '../../service/emitir-evento.service';


export interface DialogData {
  id: number;
  observacao: string;
  marcacao: boolean;
}

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private marcacoesService: MarcacoesService,
    private emitirEventoService: EmitirEventoService) { }

  ngOnInit() {
  }


  /**
   * Confirmação da exclusão da marcação.
   */
  removerMarcacoes() {
    if (!this.data.observacao) {
      HelperFrequencia.showNotification("Por favor informe o motivo da exclusão da marcação", AlertType.Error);
      return false;
    }

    if (this.data.id) {
      this.marcacoesService.removerMarcacao(this.data.id, this.data.observacao).subscribe(val => {
        HelperFrequencia.showNotification('Removido com Sucesso', AlertType.Success);
        this.onNoClick();
        this.emitirEventoService.emitir("remover", "remover");
      }, error => {
        HelperFrequencia.showNotification(error.error.message, AlertType.Error);
      });
    }
  }


  remover(): void {
    if (this.data.marcacao) {
      this.removerMarcacoes();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
