import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { FeriasService } from 'app/service/ferias.service';
import { take } from 'rxjs/operators';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ExcelService } from 'app/service/excel.service';

const ELEMENT_DAT = [
  { name: 'Comprovante de Férias', type: 'F' },
];

@Component({
  selector: 'app-importacao-arquivos',
  templateUrl: './importacao-arquivos.component.html',
  styleUrls: ['./importacao-arquivos.component.scss']
})
export class ImportacaoArquivosComponent implements OnInit {

  public newForm: FormGroup;
  public tipos = ELEMENT_DAT;
  public currentFileUpload: File;
  public selectedFiles: FileList
  public isAnexado: boolean = false;
  public select: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = [];
  public columnNames;
  public dados = new MatTableDataSource();
  public loading: boolean = false;
  mostrarPesquisa: boolean = false;
  public lista = [];
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(private _service: ArquivosFeriasService, private _excelService: ExcelService) { }

  ngOnInit() {
    this.buildForm();
    this.columns();
  }

  buildForm() {
    this.newForm = new FormGroup({
      'file': new FormControl(''),
      'tipo': new FormControl('')
    });
  }

  columns() {
    this.columnNames = [
      { id: 'matricula', value: 'Matrícula' },
      { id: 'nome', value: 'Nome' },
      { id: 'titulo', value: 'Titulo' },
      { id: 'dataAgendada', value: 'Data Agendada' },
      { id: 'valorAgendado', value: 'Valor Agendado' }]
    this.displayedColumns = this.columnNames.map(x => x.id);
  }



  AquivoUpload(event) {
    this.selectedFiles = event.target.files;
    this.currentFileUpload = event.target.files.item(0)
    this.isAnexado = true;
  }


  enviar() {
    if (this.newForm.controls['tipo'].value) {
      this.destino(this.newForm.controls['tipo'].value);
    } else {
      HelperFrequencia.showNotification("Por favor selecione um tipo de importação!", AlertType.Error);
    }
  }

  destino(tipo) {
    switch (tipo) {
      case 'F':
        this.enviarAquivoferias()
        break;
    }
  }

  enviarAquivoferias() {
    if (!this.currentFileUpload) {
      HelperFrequencia.showNotification("Arquivo não anexado!", AlertType.Error);
      return false;
    }
    if (this.currentFileUpload.size > HelperFrequencia.getMaxSizeFile()) {
      HelperFrequencia.showNotification(HelperFrequencia.msgTamanhoInvalido, AlertType.Error);
      return false;
    }
    this.loading = true;
    this._service.uploadComprovantesferias(this.currentFileUpload).pipe(take(1)).subscribe(item => {
      this.newForm.controls['file'].patchValue('');
      this.newForm.controls['tipo'].patchValue('');
      this.currentFileUpload = null;
      this.isAnexado = false;
      this.select = false;
      this._service.clearFilesZip('arquivo').pipe(take(1)).subscribe();
      console.log(item);
      if (item.length > 0) {
        this.loading = false;
        this.mostrarPesquisa = true;
        this.preencheerGrid(item);
      } else {
        this.mostrarPesquisa = false; 
        this.loading = false;      
        HelperFrequencia.showNotification("Arquivo enviado com sucesso!", AlertType.Success);
      }
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }

  preencheerGrid(item) {
    this.lista = item;
    this.dados = new MatTableDataSource(this.lista);
    this.dados.sort = this.sort;
    this.dados.paginator = this.paginator;
    HelperFrequencia.showNotification("Arquivo possui comprovantes rejeitados!", AlertType.Warning);
  }

  applyFilter(value) {
    this.dados.filter = value.trim().toLowerCase();
  }

  selected(event) {
    this.select = true;
  }

  exportAsXLSX() {

    if (this.lista.length > 0) {
      let dados = [];
      this.lista.forEach(i => {
        dados.push({
          "Matrícula": i.matricula,
          "Nome": i.nome,
          "Titulo": i.titulo,
          "Data Agendada": i.dataAgendada,
          "Valor Agendado": i.valorAgendado,
        });

      });
      this._excelService.exportAsExcelFile(dados, "rejeitados");
    }
  }

}
