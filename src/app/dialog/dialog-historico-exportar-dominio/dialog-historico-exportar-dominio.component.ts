import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-historico-exportar-dominio',
  templateUrl: './dialog-historico-exportar-dominio.component.html',
  styleUrls: ['./dialog-historico-exportar-dominio.component.scss']
})
export class DialogHistoricoExportarDominioComponent implements OnInit {

  constructor(public _dialogRef: MatDialogRef<DialogHistoricoExportarDominioComponent>,
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
      this.data.history.pipe(take(1)).subscribe(map => {
        this.dados = new MatTableDataSource(map);
        this.dados.sort = this.sortMarcacao;
        this.dados.paginator = this.paginator;
      });
    }

    columns() {
      this.columnNames = [
        { id: 'dataAtualizacao', value: 'Data atualização' },
        { id: 'nomeUsuario', value: 'Usuário Atualização' },
        { id: 'projetos', value: 'Projetos' },    
        { id: 'rublica', value: 'Rublica' },   
        { id: 'tipoexportacao', value: 'Tipo exportação' },   
        { id: 'tipoAtualizacao', value: 'Tipo atualização' },   
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
