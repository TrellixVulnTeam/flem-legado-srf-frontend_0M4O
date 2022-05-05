import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { HorarioTrabalhoService } from 'app/service/horario-trabalho.service';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-aprovar-reprovar-anexo-folha',
  templateUrl: './dialog-aprovar-reprovar-anexo-folha.component.html',
  styleUrls: ['./dialog-aprovar-reprovar-anexo-folha.component.scss']
})
export class DialogAprovarReprovarAnexoFolhaComponent implements OnInit {

  public newForm: FormGroup;
  public titulo;

  constructor(public _dialogRef: MatDialogRef<DialogAprovarReprovarAnexoFolhaComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private _service: HorarioTrabalhoService,
    private _emitirEventoService: EmitirEventoService) { }

  ngOnInit() {
    this.buildForm();
    this.titulo = this.getTitulo();
    console.log(this.data);
  }
  getTitulo() {
    if (this.data.aprovar) {
      return "Aprovar";
    } else {
      return "Reprovar";
    }
  }

  buildForm(): void {
    this.newForm = new FormGroup({
      'observacao': new FormControl(''),
    });
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  reprovar() {
    if (!this.newForm.controls['observacao'].value) {
      HelperFrequencia.showNotification("Por favor preencha o campo observação!", AlertType.Error);
      return false;
    }
    if (this.data.service) {
      this.data.service.reprovar(this.obj()).subscribe(obj => {
        HelperFrequencia.showNotification("Arquivo reprovado com sucesso.", AlertType.Success);
        this._emitirEventoService.emitir("aprovar-reprovar", "aprovar-reprovar");
        this.onNoClick();
      }, erro => {
        let mensagem = erro.error.message;
        if (!mensagem) {
          mensagem = "Ocorreu um erro inesperado!"
        }
        HelperFrequencia.showNotification(mensagem, AlertType.Error);
      });
    } else {
      this._service.reprovar(this.obj()).pipe(take(1)).subscribe(obj => {
        HelperFrequencia.showNotification("Arquivo reprovado com sucesso.", AlertType.Success);
        this._emitirEventoService.emitir("aprovar-reprovar", "aprovar-reprovar");
        this.onNoClick();
      }, erro => {
        let mensagem = erro.error.message;
        if (!mensagem) {
          mensagem = "Ocorreu um erro inesperado!"
        }
        HelperFrequencia.showNotification(mensagem, AlertType.Error);
      });
    }
  }

  aprovar() {
    if (this.data.service) {
      this.data.service.aprovar(this.obj().id).subscribe(obj => {
        HelperFrequencia.showNotification("Arquivo aprovado com sucesso.", AlertType.Success);
        this._emitirEventoService.emitir("aprovar-reprovar", "aprovar-reprovar");
        this.onNoClick();
      }, erro => {
        let mensagem = erro.error.message;
        if (!mensagem) {
          mensagem = "Ocorreu um erro inesperado!"
        }
        HelperFrequencia.showNotification(mensagem, AlertType.Error);
      });
    } else {
      this._service.aprovar(this.data.obj.id).pipe(take(1)).subscribe(item => {
        HelperFrequencia.showNotification("Arquivo aprovado com sucesso.", AlertType.Success);
        this._emitirEventoService.emitir("aprovar-reprovar", "aprovar-reprovar");
        this.onNoClick();
      }, erro => {
        let mensagem = erro.error.message;
        if (!mensagem) {
          mensagem = "Ocorreu um erro inesperado!"
        }
        HelperFrequencia.showNotification(mensagem, AlertType.Error);
      });
    }
  }

  obj() {
    return {
      id: this.data.obj.id,
      observacao: this.newForm.controls['observacao'].value,
      matricula: this.data.obj.matricula
    }
  }

}
