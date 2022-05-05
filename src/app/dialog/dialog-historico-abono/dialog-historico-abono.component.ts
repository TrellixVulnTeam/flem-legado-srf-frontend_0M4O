import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort } from '@angular/material';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-historico-abono',
  templateUrl: './dialog-historico-abono.component.html',
  styleUrls: ['./dialog-historico-abono.component.scss']
})
export class DialogHistoricoAbonoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogHistoricoAbonoComponent>,
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
      { id: 'id', value: 'Id' },
      { id: 'dataAtualizacao', value: 'Data Atualização' },
      { id: 'descStatus', value: 'Status' },
      { id: 'horaInicio', value: 'Hora inicio' },
      { id: 'horaFim', value: 'Hora Fim' },
      { id: 'nomeUsuarioAlteracao', value: 'Usuário' },
      { id: 'observacao', value: 'Observação' }
    ]
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }
}
