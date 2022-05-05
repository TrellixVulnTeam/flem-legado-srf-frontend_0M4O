import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { take } from 'rxjs/operators';
import { FrequenciaService } from 'app/service/frequencia.service';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';

@Component({
  selector: 'app-dialog-observacao-frequencia',
  templateUrl: './dialog-observacao-assinatura-frequencia.component.html',
  styleUrls: ['./dialog-observacao-assinatura-frequencia.component.scss']
})
export class DialogObservacaoAssinaturaFrequenciaComponent implements OnInit {

  publicatestado = {} as any;

  constructor(public dialogRef: MatDialogRef<DialogObservacaoAssinaturaFrequenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private _frequeciaService: FrequenciaService) { }

  ngOnInit() {
    this.carregarObservacao();
  }

  carregarObservacao(){
    this.data.getObservacao.subscribe(map => {
      this.data.observacao = map.value;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  

  salvar() {
    let obj = {} as any;
    obj.id = this.data.id;
    obj.observacao = this.data.observacao;
    this._frequeciaService.salvarObservacaoPontoFocal(obj).pipe(take(1)).subscribe(obj => {
      HelperFrequencia.showNotification("Observação salva com sucesso.", AlertType.Success);
      this.onNoClick();
    }, erro => {
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
    });
  }

  limpar(){
    this.data.observacao = "";
  }



}
