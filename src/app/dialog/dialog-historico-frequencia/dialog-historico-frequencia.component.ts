import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-dialog-historico-frequencia',
  templateUrl: './dialog-historico-frequencia.component.html',
  styleUrls: ['./dialog-historico-frequencia.component.scss']
})
export class DialogHistoricoFrequenciaComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogHistoricoFrequenciaComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  columnNames;
  displayedColumns: string[] = [];
  dados = new MatTableDataSource();
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sortMarcacao: MatSort;

  ngOnInit() {
    this.columns();
    this.getHistory();
  }

  columns() {
    this.columnNames = [
      { id: 'usuarioValidador', value: 'Usuário validador' },
      { id: 'dataHoraValidacao', value: 'Data de validação' },
      { id: 'dataAtualizacao', value: 'Data de atualização' },
      { id: 'descStatus', value: 'Status' },    
      { id: 'temAnexo', value: 'Contém anexo' },
      { id: 'observacao', value: 'Observação' }
    ]
    this.displayedColumns = this.columnNames.map(x => x.id);
  }

  getHistory(): void {
    this.data.history.pipe(take(1)).subscribe(map => {
      this.dados = new MatTableDataSource(map);
      this.dados.sort = this.sortMarcacao;
      this.dados.paginator = this.paginator;
    });
  }
  applyFilter(filterValue: string) {
    this.dados.filter = filterValue.trim().toLowerCase();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }


}
