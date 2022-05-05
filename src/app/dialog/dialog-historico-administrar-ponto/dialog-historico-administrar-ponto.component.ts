import { Component, OnInit, Inject, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-dialog-historico-administrar-ponto',
  templateUrl: './dialog-historico-administrar-ponto.component.html',
  styleUrls: ['./dialog-historico-administrar-ponto.component.scss']
})
export class DialogHistoricoAdministrarPontoComponent implements OnInit {
  // history$;
  displayedColumns: string[] = [];
  abonoDisplayedColumns: string[] = [];
  dados = new MatTableDataSource();
  dadosAbono = new MatTableDataSource();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorAbono') paginatorAbono: MatPaginator;
  @ViewChild('sortMarcacao') sortMarcacao: MatSort;
  @ViewChild('sortAbono') sortAbono: MatSort;
  columnNames;
  anoboColumnNames;
  dataMarcacao;
  // dataSource = new MatTableDataSource<any[]>();


  constructor(public dialogRef: MatDialogRef<DialogHistoricoAdministrarPontoComponent>, @Inject(MAT_DIALOG_DATA) public data) {

  }

  ngOnInit() {

    this.columns();
    this.abonoColumns();
    this.dataMarcacao = this.data.dataMarcacao;
    this.data.history.subscribe(map=>{
      this.dados = new MatTableDataSource(map);
      this.dados.sort = this.sortMarcacao;
      this.dados.paginator = this.paginator;
      // console.log(this.dados.data);
    });
    this.data.historyAbono.subscribe(map => {
      this.dadosAbono = new MatTableDataSource(map);
      this.dadosAbono.sort = this.sortAbono;
      this.dadosAbono.paginator = this.paginatorAbono;
      // console.log(this.dadosAbono.data);
    });

  }

  columns() {
    this.columnNames = [
      {id: 'idMarcacao', value:'Id'},
      {id: 'dtAtualizacao', value:'Data Atualização'},
      {id: 'descStatus', value:'Status'},
      {id: 'horaMarcacao', value:'Hora Marcação'},
      {id: 'nomeUsuarioAlteracao', value:'Usuário'},
      {id: 'observacao', value:'Observação'}
    ]
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  abonoColumns() {
    this.anoboColumnNames = [
      { id: 'id', value: 'Id' },
      { id: 'dataAtualizacao', value: 'Data Atualização' },
      { id: 'descStatus', value: 'Status' },
      { id: 'horaInicio', value: 'Hora inicio' },
      { id: 'horaFim', value: 'Hora Fim' },
      { id: 'nomeUsuarioAlteracao', value: 'Usuário' },
      { id: 'observacao', value: 'Descrição Justificativa' }

    ]
    this.abonoDisplayedColumns = this.anoboColumnNames.map(x => x.id);
  }

  applyFilter(filterValue: string) {
    this.dados.filter = filterValue.trim().toLowerCase();
  }

  applyFilterAbono(filterValue: string) {
    this.dadosAbono.filter = filterValue.trim().toLowerCase();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
