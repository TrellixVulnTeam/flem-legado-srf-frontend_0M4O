import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { UserDataService } from 'app/service/user-data.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { HorarioTrabalhoService } from 'app/service/horario-trabalho.service';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-anexar-horario-trabalho',
  templateUrl: './anexar-horario-trabalho.component.html',
  styleUrls: ['./anexar-horario-trabalho.component.scss']
})
export class AnexarHorarioTrabalhoComponent implements OnInit {

  public selectedFiles: FileList
  public currentFileUpload: File;
  public lista = [];
  public jornada = [];
  public listaAtiva: boolean;
  public isAnexou = false;
  public isAlterar: boolean = false;
  public matricula: number;
  public newForm: FormGroup;

  constructor(private _user: UserDataService,
    private _service: HorarioTrabalhoService,
    private _emitirEventoService: EmitirEventoService) { }

  ngOnInit() {
    this.emiter();
    this.buildForm();
  }

  emiter() {
    this._emitirEventoService.mensagem.subscribe(obj => {
      if (obj) {
        this.getTypeEmiter(obj);
      }
    });
  }

  getTypeEmiter(obj) {
    if (obj.type === 'funcionario') {
      this.matricula = obj.data.codigoDominio;
      this.obterJornada(this.matricula)
    }
    return false;
  }

  obterJornada(matricula) {
    this._service.obterJornada(matricula).pipe(take(1)).subscribe(item => {
      this.jornada = item;
      // console.log(item);
    });
  }

  AquivoUpload(event) {
    this.selectedFiles = event.target.files;
    this.currentFileUpload = event.target.files.item(0)
  }

  //  remove uma linha da grid
  remover(index): void {
    this.lista.splice(index, 1);
    if (this.lista.length == 0) {
      this.listaAtiva = false;
      this.isAnexou = false;
    }
  }

  alterar() {
    if (this.isAlterar) {
      this.isAlterar = false;
    } else {
      this.isAlterar = true;
    }
  }

  adicionar() {
    if (this.currentFileUpload) {
      if (!HelperFrequencia.extPermitidas(this.currentFileUpload.name)) {
        HelperFrequencia.showNotification(HelperFrequencia.msgExtInvalidas, AlertType.Error);
        return false;
      }
      if (this.currentFileUpload.size > HelperFrequencia.getMaxSizeFile()) {
        HelperFrequencia.showNotification(HelperFrequencia.msgTamanhoInvalido, AlertType.Error);
        return false;
      }
      if (!HelperFrequencia.validarNomeArquivo(this.currentFileUpload.name)) {
        HelperFrequencia.showNotification(HelperFrequencia.msgNomeInvalido(), AlertType.Error);
        return false;
      }
      let obj = {
        nome: this.currentFileUpload.name,
        arquivo: this.currentFileUpload,
      }
      this.listaAtiva = true;
      // let existe: boolean = false;
      // this.lista.forEach(item => {
      //   if (item.tipo == obj.nome) {
      //     existe = true;
      //   }
      // });
      // if (existe) {
      //   HelperFrequencia.showNotification("Tipo de arquivo já adicionado", AlertType.Error);
      //   return false;
      // }
      this.lista.push(obj);
      this.isAnexou = true;
    } else {
      HelperFrequencia.showNotification("Por favor seleciona um arquivo", AlertType.Error);
    }

  }

  buildForm() {
    this.newForm = new FormGroup({
      'inicio': new FormControl({ value: '', disabled: true }),
      'fim': new FormControl({ value: '', disabled: true }),
      'alterar': new FormControl(''),
      'file': new FormControl('')
    });
  }

  enviar() {
    this._service.uploadHorasTrabalho(this.matricula, this.currentFileUpload).pipe(take(1)).subscribe(item => {
      HelperFrequencia.showNotification("Arquivo enviado com sucesso!", AlertType.Success);
      this.lista = [];
      this.newForm.controls['file'].patchValue('');
      this.currentFileUpload = null;
      this.listaAtiva = false;
      this.isAnexou = false;
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }

}
