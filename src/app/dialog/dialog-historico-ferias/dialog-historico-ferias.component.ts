import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-historico-ferias',
  templateUrl: './dialog-historico-ferias.component.html',
  styleUrls: ['./dialog-historico-ferias.component.scss']
})
export class DialogHistoricoFeriasComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogHistoricoFeriasComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

    columnNames;
    displayedColumns: string[] = [];
    dados = new MatTableDataSource();
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('sort') sortMarcacao: MatSort;
    public pageIndex: number = 0;

  ngOnInit() {
    this.columns();
    this.getHistory();
  }

  getHistory(): void {
    this.data.history.pipe(take(1)).subscribe(map => {
      this.dados = new MatTableDataSource(map);
      this.dados.sort = this.sortMarcacao;
      this.dados.paginator = this.paginator;
    });
  }

  columns() {
    this.columnNames = [
      { id: 'dataInicio', value: 'Inicio' },
      { id: 'dataFim', value: 'Fim' },
      { id: 'diasDireito', value: 'Dias de direito' },
      { id: 'diasGozo', value: 'Dias de gozo' },
      { id: 'dataRetorno', value: 'Retorno' },
      { id: 'situacao', value: 'Situação' },
      { id: 'dataAtualizacao', value: 'Data Atualização' },
      { id: 'usuarioAtualizacao', value: 'Usuário Atualização' },
      { id: 'alteradoDominio', value: 'Alteração Domínio' },
    ]
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  paginatorEvent(event) {
    this.pageIndex = event.pageIndex;
  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }
  

}
