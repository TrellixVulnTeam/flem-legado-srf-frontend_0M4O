import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-historico-arquivo-jornada',
  templateUrl: './dialog-historico-arquivo-jornada.component.html',
  styleUrls: ['./dialog-historico-arquivo-jornada.component.scss']
})
export class DialogHistoricoArquivoJornadaComponent implements OnInit {

  constructor(public _dialogRef: MatDialogRef<DialogHistoricoArquivoJornadaComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  public columnNames;
  public displayedColumns: string[] = [];
  public dados = new MatTableDataSource();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sortMarcacao: MatSort;

  ngOnInit() {
    this.columns();
    this.getHistory();
  }

  getHistory(): void {
    if(this.data.columns) {
      this.columnNames = this.data.columns;
      this.displayedColumns = this.data.columns.map(x => x.id);
    }
    this.data.history.pipe(take(1)).subscribe(map => {
      this.dados = new MatTableDataSource(map);
      this.dados.sort = this.sortMarcacao;
      this.dados.paginator = this.paginator;
    });
  }

  columns() {
    this.columnNames = [
      { id: 'descSituacaoHorario', value: 'Situação' },
      { id: 'nome', value: 'Usuário Atualização' },
      { id: 'dataAtualizacao', value: 'Data Atualização' },
    ]
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }

 
}
