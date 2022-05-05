import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { ExportarDominioService } from 'app/service/exportar-dominio.service';


export interface DialogData {
  id: number;
  competencia: string;
}

@Component({
  selector: 'app-dialog-competencia',
  templateUrl: './dialog-competencia.component.html',
  styleUrls: ['./dialog-competencia.component.scss']
})
export class DialogCompetenciaComponent implements OnInit {

  public mask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];
  public loading:boolean;
  constructor(public dialogRef: MatDialogRef<DialogCompetenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private emitirEventoService: EmitirEventoService,
    private _exportarDominioService: ExportarDominioService) { }

  ngOnInit() {
  }

  /**
   * Confirmação da exclusão da marcação.
   */
  confirmar() {
    if (!this.data.competencia) {
      HelperFrequencia.showNotification("Por favor informe a competência. (mês/ano)", AlertType.Error);
      return false;
    }else{

      let obj = {
        id: this.data.id,
        competencia: this.data.competencia
      }
      // console.log(obj)
      this.loading = true;
      this._exportarDominioService.pagamentoFaltasRegularizadas(obj).subscribe(item => {
        this.emitirEventoService.emitir("competencia", "sucesso");
        this.loading = false;
        this.onNoClick();
      }, erro => {
        this.loading = false;
        HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
      });
        //console.log("Emitiu a competencia: " + this.data.competencia);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
