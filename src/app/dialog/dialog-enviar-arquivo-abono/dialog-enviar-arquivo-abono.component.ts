import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileService } from 'app/service/file.service';
import { UserDataService } from 'app/service/user-data.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';

@Component({
  selector: 'app-dialo-enviar-abono',
  templateUrl: './dialog-enviar-arquivo-abono.component.html',
  styleUrls: ['./dialog-enviar-arquivo-abono.component.scss']
})
export class DialogEnviarArquivoAbonoComponent implements OnInit {

  
  @ViewChild('fileInput') fileInput: ElementRef;
  public selectedFiles: FileList
  public currentFileUpload: File;

  constructor(public dialogRef: MatDialogRef<DialogEnviarArquivoAbonoComponent>,
              @Inject(MAT_DIALOG_DATA) public data, 
              private fileService: FileService, 
              private emitirEventoService: EmitirEventoService) { }



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

  // enviar abono anexa
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
      this.fileService.uploadArquivoAbono(this.currentFileUpload, this.data.id).subscribe(folha => {
        HelperFrequencia.showNotification("Abono anexado com sucesso!", AlertType.Success);
        this.emitirEventoService.emitir("abono", "abono");
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
