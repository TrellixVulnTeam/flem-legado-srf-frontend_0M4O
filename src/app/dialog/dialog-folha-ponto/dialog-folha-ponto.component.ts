import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileService } from '../../service/file.service';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { UserDataService } from '../../service/user-data.service';
import { EmitirEventoService } from '../../service/emitir-evento.service';

@Component({
  selector: 'app-dialog-folha-ponto',
  templateUrl: './dialog-folha-ponto.component.html',
  styleUrls: ['./dialog-folha-ponto.component.scss']
})
export class DialogFolhaPontoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogFolhaPontoComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private fileService: FileService, private user: UserDataService, private emitirEventoService: EmitirEventoService) { }


  @ViewChild('fileInput') fileInput: ElementRef;

  selectedFiles: FileList
  currentFileUpload: File;

  ngOnInit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
 * Preenche o objeto this.currentFileUpload com o arquivo carregado
 * @param event 
*/
  upload(event) {
    this.selectedFiles = event.target.files;
    this.currentFileUpload = event.target.files.item(0)
  }

  // enviar frequencia anexa
  confirmar() {
    if (this.currentFileUpload) {
      if (!HelperFrequencia.extPermitidas(this.currentFileUpload.name)) {
        HelperFrequencia.showNotification(HelperFrequencia.msgExtInvalidas(), AlertType.Error);
        return false;
      }

      if (this.currentFileUpload.size > HelperFrequencia.getMaxSizeFile()) {
        HelperFrequencia.showNotification(HelperFrequencia.msgTamanhoInvalido(), AlertType.Error);
        return false;
      }

      if (!HelperFrequencia.validarNomeArquivo(this.currentFileUpload.name)) {
        HelperFrequencia.showNotification(HelperFrequencia.msgNomeInvalido(), AlertType.Error);
        return false;
      }
      this.fileService.uploadFrequenciaAssinada(this.currentFileUpload, this.data.id).subscribe(folha => {
        HelperFrequencia.showNotification("Frequência anexada com sucesso!", AlertType.Success);
        this.emitirEventoService.emitir("mensagem", "anexada");
        this.onNoClick();
      }, error => {
        let msg = error.error.message;
        if (!msg) {
          msg = "Ocorreu um erro inesperado!"
        }
        HelperFrequencia.showNotification(msg, AlertType.Error);
      });
    } else {
      HelperFrequencia.showNotification("Por favor seleciona um arquivo", AlertType.Error);
    }
  }

}
