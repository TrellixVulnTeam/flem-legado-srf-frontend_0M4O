import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertType } from 'app/model/alert-type';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { FeriasService } from 'app/service/ferias.service';
import { FormGroup, FormControl } from '@angular/forms';
import { UserDataService } from 'app/service/user-data.service';
import { take } from 'rxjs/operators';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';

@Component({
  selector: 'app-dialog-upload-arquivo-ferias',
  templateUrl: './dialog-upload-arquivo-ferias.component.html',
  styleUrls: ['./dialog-upload-arquivo-ferias.component.scss']
})
export class DialogUploadArquivoFeriasComponent implements OnInit {

  public titulo: string;

  constructor(public _dialogRef: MatDialogRef<DialogUploadArquivoFeriasComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private _service: ArquivosFeriasService,
    private _user: UserDataService, private _emitirEventoService: EmitirEventoService) { }

  public selectedFiles: FileList
  public currentFileUpload: File;
  public TAMANHO_MAXIMO: number = 5242880;
  public newForm: FormGroup;
  public tipos = [];
  public lista = [];
  public listaAtiva: boolean;
  public arquivos = [];

  ngOnInit() {
    this.buildForm();
    this.tipos = this.carregarComboAviso();
    this.getArquivosSalvos();

  }

  upload(event) {
    this.selectedFiles = event.target.files;
    this.currentFileUpload = event.target.files.item(0)
  }

  enviar(item, size, idx) {
    let obj = this.preencherOBJ(item.tipo);

    this._service.uploadAviso(item.arquivo, obj).subscribe(folha => {
      if (size == idx) {
        HelperFrequencia.showNotification("Frequência anexada com sucesso!", AlertType.Success);
        this._emitirEventoService.emitir("upload", this.data.matricula);
        this.onNoClick();
      }
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });

  }
  onNoClick(): void {
    this._dialogRef.close();
  }

  extPermitidas(name): boolean {
    let valida: boolean = false;
    let array = [];
    array = name.split(".");
    let ext = ['jpg', 'jpeg', 'png', 'pdf', 'jpeg', 'PDF', 'JPG', 'JPEG', 'PNG'];
    ext.forEach(i => {
      if (array[array.length - 1] == i) {
        valida = true;
      }
    });
    return valida;
  }

  preencherOBJ(tipo) {
    let obj = {
      dtInicio: this.formatDateStryyyyMMdd(this.data.dataInicio),
      dtFim: this.formatDateStryyyyMMdd(this.data.dataFim),
      id: this.data.id,
      tipo: tipo,
      matricula: this.data.matricula
    }
    return obj;
  }

  formatDateStryyyyMMdd(date): string {
    return date = date.substring(6, date.length) + "-" + date.substring(3, 5) + "-" + date.substring(0, 2);
  }

  buildForm(): void {
    this.newForm = new FormGroup({
      'tipo': new FormControl(''),
    });
  }


  getArquivosSalvos(): void {
    this.data.arquivos.pipe(take(1)).subscribe(item => {
      this.arquivos = item;
      this.arquivos.forEach(i => {
        this.carregarCombo(i.tipo);
      });
    });
  }

  carregarCombo(item) {
    if (item == 'AVISO' && this.hasPermission('uploadReciboFeriasSRF')) {
      let recibo = this.tipos.find(i=>i=="Recibo")
      if(!recibo){
        this.tipos.push('Recibo');
      }  
    }
    if (item == 'AVISO' && this.hasPermission('uploadCompPGTOFeriasSRF')) {
      let comPtgto = this.tipos.find(i=>i=="Comprovante de Pagamento")
      if(!comPtgto && this.hasPermission('srf_userAdm')){
        this.tipos.push('Comprovante de Pagamento');
      } 
    }
  }

  carregarComboAviso() {
    let dados = [];
    if (this.hasPermission('uploadAvisoFeriasSRF')) {
      dados.push('Aviso');
    }
    if (this.hasPermission('srf_userAdm')) {
      dados.push('Recibo');
    }
    if (this.hasPermission('srf_userAdm')) {
      dados.push('Comprovante de Pagamento');
    }
    return dados;
  }


  hasPermission(permission) {
    return this._user.hasPermission(permission);
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

  adicionar() {
    if (this.currentFileUpload) {
      if (!this.extPermitidas(this.currentFileUpload.name)) {
        HelperFrequencia.showNotification("Apenas estes formatos de arquivos são válidos:'jpg, jpeg, png e pdf'", AlertType.Error);
        return false;
      }
      if (this.currentFileUpload.size > this.TAMANHO_MAXIMO) {
        HelperFrequencia.showNotification("O tamanho do arquivo é superior a 5 Megabytes", AlertType.Error);
        return false;
      }
      if (!this.newForm.controls['tipo'].value) {
        HelperFrequencia.showNotification("Por favor escolha um tipo de arquivo", AlertType.Error);
        return false;
      }
      let obj = {
        nome: this.currentFileUpload.name,
        tipoView: this.newForm.controls['tipo'].value,
        arquivo: this.currentFileUpload,
        tipo: this.getEnum(this.newForm.controls['tipo'].value)
      }

      this.listaAtiva = true;
      let existe: boolean = false;
      this.lista.forEach(item => {
        if (item.tipo == obj.tipo) {
          existe = true;
        }
      });
      if (existe) {
        HelperFrequencia.showNotification("Tipo de arquivo já adicionado", AlertType.Error);
        return false;
      }
      this.lista.push(obj);

    } else {
      HelperFrequencia.showNotification("Por favor seleciona um arquivo", AlertType.Error);
    }

  }

  confirmar() {
    let idx = 1;
    console.log(idx);
    this.lista.forEach(item => {
      this.enviar(item, this.lista.length, idx);
      idx++;
    });
  }

  //  remove uma linha da grid
  remover(index): void {
    this.lista.splice(index, 1);
    if (this.lista.length == 0) {
      this.listaAtiva = false;
    }
  }

}
