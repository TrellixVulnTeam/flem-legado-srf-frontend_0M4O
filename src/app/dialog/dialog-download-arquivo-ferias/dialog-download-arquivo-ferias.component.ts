import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { UserDataService } from 'app/service/user-data.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-dialog-download-arquivo-ferias',
  templateUrl: './dialog-download-arquivo-ferias.component.html',
  styleUrls: ['./dialog-download-arquivo-ferias.component.scss']
})
export class DialogDownloadArquivoFeriasComponent implements OnInit, OnDestroy {

  constructor(public _dialogRef: MatDialogRef<DialogDownloadArquivoFeriasComponent>,
              @Inject(MAT_DIALOG_DATA) public data, 
              private _service: ArquivosFeriasService,
              private _datePipe: DatePipe,
              private _user: UserDataService) { }

  public newForm: FormGroup;
  public tipos = [];
  public arquivos = [];
  public todos: boolean = false;

  ngOnInit() {
    this.getArquivosSalvos();
    this.buildForm();

  }
 
  buildForm(): void {
    this.newForm = new FormGroup({
      'tipo': new FormControl(''),
    });
  }


  getArquivosSalvos(): void {
    this.data.arquivos.pipe(take(1)).subscribe(item => {
      this.arquivos = item;
      this.tipos = [];
      let count = 1;
      this.arquivos.forEach(i => {
        this.carregarCombo(i.tipo,this.arquivos.length,count)
        count++;
      });
    });
  }

  carregarCombo(item, tamanho,count) {
    if (item == 'AVISO') {
      this.tipos.push('Aviso');
    }
    if (item == 'RECIBO') {
      this.tipos.push('Recibo');
    }
    if (item == 'COMP_PGTO') {
      this.tipos.push('Comprovante de Pagamento');
    }
    if (tamanho == count) {
      this.tipos.push('Todos');
    }
  }


  getEnum(tipo): string {
    switch (tipo) {
      case 'Aviso':
        return 'AVISO'
      case 'Recibo':
        return 'RECIBO'
      case 'Comprovante de Pagamento':
        return 'COMP_PGTO'
    }
  }


  confirmar() {

  }
  onNoClick(): void {
    this._dialogRef.close();
  }

  download() {
    if (this.newForm.controls['tipo'].value != 'Todos') {
      this.arquivo();
    } else {
      this._service.ziparArquivos(this.data.id).pipe(take(1)).subscribe(item => {
        this.downloadZip(item.value);
      }, error => {
        console.log(error);
        HelperFrequencia.showNotification(error.error.message, AlertType.Error);
      });
    }

  }

  arquivo() {
    this._service.downloadAnexo(this.data.id, this.getEnum(this.newForm.controls['tipo'].value)).subscribe(response => {
      let nome: string = this.newForm.controls['tipo'].value;
      nome = nome.toLowerCase();
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = nome + "." + type[1];
      a.click();
      this.todos = false;
      this.onNoClick();
    }, error => {
      HelperFrequencia.showNotification("Arquivo não localizado", AlertType.Error);
    });
  }


  downloadZip(link) {
    this._service.downloadFilesZip(link).subscribe(response => {
      let a = document.createElement('a');
      let blob = new Blob([response], { 'type': "application/zip" });
      a.href = URL.createObjectURL(blob);
      a.download = "arquivos." + this._datePipe.transform(new Date(), 'ddMMyyyy')+ ".zip";
      a.click();
      this.todos = true;
    }, erro => {
      HelperFrequencia.showNotification("Erro ao baixar Frequências", AlertType.Error);
    });
  }

  ngOnDestroy() {
    if (this.todos) {
      this._service.clearFilesZip('zip').pipe(take(1)).subscribe();
    }

  }
  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }


}
