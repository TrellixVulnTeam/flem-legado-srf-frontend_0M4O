import { Component, OnInit, ViewChild, Input, ɵConsole, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { AlertType } from '../../model/alert-type';
import { FolhasDisponibilizadaService } from '../../service/folhas-disponibilizada.service';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { FrequenciaService } from '../../service/frequencia.service';
import { take } from 'rxjs/operators';
import { DialogConfirmFrequenciaDisponibilizadaComponent } from '../../dialog/dialog-confirm-frequencia-disponibilizada/dialog-confirm-frequencia-disponibilizada.component';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { UserDataService } from 'app/service/user-data.service';
import { FileService } from 'app/service/file.service';

@Component({
  selector: 'app-folhas-disponibilizada',
  templateUrl: './folhas-disponibilizada.component.html',
  styleUrls: ['./folhas-disponibilizada.component.scss']
})
export class FolhasDisponibilizadaComponent implements OnInit, OnDestroy {
  newForm: FormGroup;
  public mask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/,];

  constructor(private _folhasDisponibilizadasService: FolhasDisponibilizadaService,
    public dialog: MatDialog, private _emitirEventoService: EmitirEventoService, private _user: UserDataService,
    private _fileService: FileService) { }

  displayedColumns: string[] = [];
  columnNames;
  pesquisaAtiva: boolean = false;
  dados = new MatTableDataSource();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  public loading = false;
  public listFiles;
  public isLinksAtivos = false;
  public isBtBaixar: boolean = false;

  ngOnInit() {
    this.buildForm();
    this.emiter();
  }

  buildForm(): void {
    this.newForm = new FormGroup({
      'mesAno': new FormControl(''),
      'matricula': new FormControl('')
    });
    this.columns();
  }

  buscar() {
    this.isLinksAtivos = false;
    const matricula = this.newForm.controls['matricula'].value;
    const mesAno = this.newForm.controls['mesAno'].value;
    if (this.validarCampos(matricula, mesAno)) {
      HelperFrequencia.showNotification("Por favor informe a Matricula ou Mês Ano", AlertType.Error);
      return false;
    }
    let obj = {
      matricula: matricula,
      competencia: mesAno != "" ? mesAno : null
    };
    let rows = [];
    this.loading = true;
    this.isBtBaixar = false;
    this._folhasDisponibilizadasService.obterFrequenciasDisponibilizadas(obj).pipe(take(1)).subscribe(obj => {
      rows = obj;
      this.dados = new MatTableDataSource(rows);
      this.dados.sort = this.sort;
      this.dados.paginator = this.paginator;
      this.pesquisaAtiva = true;
      this.loading = false;
      if (rows.length > 1) {
        this.isBtBaixar = true;
      }

    }, erro => {
      let mensagem = erro.error.message;
      this.loading = false;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }


  columns() {
    this.columnNames = [
      { id: 'cpf', value: 'CPF' },
      { id: 'matricula', value: 'Matricula' },
      { id: 'nome', value: 'Nome' },
      { id: 'competencia', value: 'Mês Ano' },
      { id: 'situacaoFrequenciaDesc', value: 'Situação' },
      { id: 'idFrquencia', value: 'Ação' }
    ];
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  downloadPDF(item) {

    this._fileService.downloadFileFrequencia(item.idFrequencia).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const type = response.type.split("/");
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = "frequencia." + type[1];
      a.click();
    }, error => {
      item.loading = false;
      HelperFrequencia.showNotification("Arquivo não localizado", AlertType.Error);
    });
  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }

  aprovar(id) {
    this.validarFrequenciaDisponibilizada(id);
  }

  validarFrequenciaDisponibilizada(item): void {
    item.loading = true;
    item.aprovado = true;
    this._folhasDisponibilizadasService.validarFrequenciaDisponibilizada(item).pipe(take(1)).subscribe(obj => {
      HelperFrequencia.showNotification("Frequência aprovada com sucesso.", AlertType.Success);
      item.loading = false;
      this.buscar();
    }, erro => {
      console.log(erro);
      let mensagem = erro.error.message;
      item.loading = false;
      if (!mensagem) {
        mensagem = "Ocorreu um erro inesperado!"
      }
      HelperFrequencia.showNotification(mensagem, AlertType.Error);
    });
  }


  /**
  * Dialog para reprovar a frequencia
  */
  openDialogConfirm(item): void {
    const dialogRef = this.dialog.open(DialogConfirmFrequenciaDisponibilizadaComponent, {
      width: '800px',
      data: {
        obj: item
      }
    });
  }
  emiter(): void {
    this._emitirEventoService.mensagem.subscribe(obj => {
      if (obj.data == 'reprovar') {
        this.buscar();
      }
    });
  }


  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }

  baixarEmlote() {

    const matricula = this.newForm.controls['matricula'].value;
    const mesAno = this.newForm.controls['mesAno'].value;
    if (this.validarCampos(matricula, mesAno)) {
      HelperFrequencia.showNotification("Por favor informe a Matricula ou Mês Ano", AlertType.Error);
      return false;
    }

    this.loading = true;
    let listaLink = [];
    let count: number = 1;
    this.listFiles = [];
    this._folhasDisponibilizadasService.gerarFilesZip(this.filtros(matricula, mesAno)).subscribe(response => {
      if (response) {
        listaLink = response;
        listaLink.forEach(link => {
          this.listFiles.push(this.objLinks(link));
          if (count == listaLink.length) {
            this.loading = false;
            this.isLinksAtivos = true;
          }
          count++;
        });
      }
    }, erro => {
      this.loading = false;
      HelperFrequencia.showNotification(erro.error.message, AlertType.Error);
    });
  }

  filtros(matricula, mesAno) {
    let obj = {
      matricula: matricula,
      competencia: mesAno != "" ? mesAno : null
    };
    return obj;
  }

  objLinks(link) {
    let array = link.split("/");
    let obj = {
      "nome": array[array.length - 1],
      "link": link
    };
    return obj;
  }

  download(link) {

    this._folhasDisponibilizadasService.downloadFilesZip(link).subscribe(response => {
      let a = document.createElement('a');
      let blob = new Blob([response], { 'type': "application/zip" });
      a.href = URL.createObjectURL(blob);
      let array = link.split("/");
      a.download = array[array.length - 1];
      a.click();
    }, erro => {
      this.loading = false;
      HelperFrequencia.showNotification("Erro ao baixar Frequências", AlertType.Error);
    });
  }

  validarCampos(matricula, mesAno): boolean {
    if (!matricula && !mesAno) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this._folhasDisponibilizadasService.clearFilesZip().pipe(take(1)).subscribe();
  }

}
