import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-aprovar-reprovar-ferias',
  templateUrl: './dialog-aprovar-reprovar-ferias.component.html',
  styleUrls: ['./dialog-aprovar-reprovar-ferias.component.scss']
})
export class DialogAprovarReprovarFeriasComponent implements OnInit {

  public newForm: FormGroup;
  public titulo;

  constructor(public _dialogRef: MatDialogRef<DialogAprovarReprovarFeriasComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private _service: ArquivosFeriasService,
    private _emitirEventoService: EmitirEventoService) { }

  ngOnInit() {
    this.buildForm();
    this.titulo = this.getTitulo();
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

  obj() {
    return {
      id: this.data.element.id,
      idFerias: this.data.element.idFerias,
      observacao: this.newForm.controls['observacao'].value,
      tipo: this.data.element.tipo
    }
  }

  reprovar() {
    if (!this.newForm.controls['observacao'].value) {
      HelperFrequencia.showNotification("Por favor preencha o campo observação!.", AlertType.Success);
      return false;
    }
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

  aprovar() {
    this._service.aprovar(this.data.element.id).pipe(take(1)).subscribe(item => {
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
