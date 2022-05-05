import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { take } from 'rxjs/operators';
import { UserDataService } from 'app/service/user-data.service';
import { DialogAprovarReprovarAnexoFolhaComponent } from '../dialog-aprovar-reprovar-anexo-folha/dialog-aprovar-reprovar-anexo-folha.component';
import { AlertType } from 'app/model/alert-type';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { DadosFuncionarioService } from 'app/service/dados-funcionario.service';
import { DialogHistoricoArquivoJornadaComponent } from '../dialog-historico-arquivo-jornada/dialog-historico-arquivo-jornada.component';

@Component({
  selector: 'app-dialog-pendencia',
  templateUrl: './dialog-pendencia.component.html',
  styleUrls: ['./dialog-pendencia.component.scss']
})
export class DialogPendenciaComponent implements OnInit {

  constructor(public _dialogRef: MatDialogRef<DialogPendenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private _user: UserDataService,  private _dialog: MatDialog, private _service: DadosFuncionarioService) { }

  public columnNames;
  public displayedColumns: string[] = [];
  public dados = new MatTableDataSource();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sortMarcacao: MatSort;
  public loading: boolean = true;
  public title;
  ngOnInit() {
    this.columns();
    this.getDados();
  }

  getDados(): void {
    this.data.service.subscribe(item => {
      let dd = [];
      item.forEach(element => {
        if (element.pendenciaComprovante) {
          dd = dd.concat(element.pendenciaComprovante);
        }
        if (element.pendenciaEmail) {
          dd = dd.concat(element.pendenciaEmail);
        }
        if (element.pendenciaTelefone) {
          dd = dd.concat(element.pendenciaTelefone);
        }
        dd.sort(this.ordenarPorDataAtualizacao);
        this.dados =  new MatTableDataSource(dd);
        this.dados.sort = this.sortMarcacao;
        this.dados.paginator = this.paginator;
        this.title = element.funcionario.matricula + ' - ' + element.funcionario.nome;
         this.loading  = false;
      });
      });
  }

  ordenarPorDataAtualizacao(a, b ) {
    return a.dataAtualizacao > b.dataAtualizacao ? -1 : 1;
  }

  columns() {
    if(this.data.columns) {
      this.columnNames = this.data.columns;
      this.displayedColumns = this.data.columns.map(x => x.id);
    }
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }

  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }

  download(item) {
    item.loading = true;
    this._service.downloadFile(item.id).subscribe(response => {
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.href = url;
      a.download = item.fileName;
      a.click();
      item.loading = false;
    }, error => {
      item.loading = false;
      HelperFrequencia.showNotification("Arquivo não localizado", AlertType.Error);
    });
  }

  aprovar(item) {
    this.openDialog(item, true);
  }

  reprovar(item) {
    this.openDialog(item, false);
  }


  openDialog(item, aprovar) {
    const dialogRef = this._dialog.open(DialogAprovarReprovarAnexoFolhaComponent, {
      width: '600px',
      data: {
        obj: item,
        aprovar: aprovar,
        service: this._service
      }
    });
    dialogRef.afterClosed().subscribe(x => {
      this.getDados();
    });
  }

  historico(id) {
    const dialogRef = this._dialog.open(DialogHistoricoArquivoJornadaComponent, {
      width: '900px',
      data: {
        history: this._service.obterHistorico(id),
        columns: this.carregarColumnsHist()
      }
    });
  }

  carregarColumnsHist(){
   return   [
      { id: 'status', value: 'Situação' },
      { id: 'usuarioAtualizacao', value: 'Usuário Atualização' },
      { id: 'dataAtualizacao', value: 'Data Atualização' },
      { id: 'descricao', value: 'Descrição' },
      { id: 'valor', value: 'Ateração' },
    ];
  }
 
}
