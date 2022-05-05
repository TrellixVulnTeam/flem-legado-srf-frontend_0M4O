import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-historico-arquivo',
  templateUrl: './dialog-historico-arquivo.component.html',
  styleUrls: ['./dialog-historico-arquivo.component.scss']
})
export class DialogHistoricoArquivoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogHistoricoArquivoComponent>,
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

  getHistory(): void {
    this.data.history.pipe(take(1)).subscribe(map => {
      this.dados = new MatTableDataSource(map);
      this.dados.sort = this.sortMarcacao;
      this.dados.paginator = this.paginator;
    });
  }

  columns() {
    this.columnNames = [
      { id: 'situacao', value: 'Situação' },
      { id: 'dataAtualizacao', value: 'Data atualização' },
      { id: 'usuarioValidador', value: 'Usuário atualização' },    
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
