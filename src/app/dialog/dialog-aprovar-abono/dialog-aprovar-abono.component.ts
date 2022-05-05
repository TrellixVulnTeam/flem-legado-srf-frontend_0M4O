import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { ArquivosFeriasService } from 'app/service/arquivos-ferias.service';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { take } from 'rxjs/operators';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { AbonoService } from 'app/service/abono.service';

@Component({
  selector: 'app-dialog-aprovar-abono',
  templateUrl: './dialog-aprovar-abono.component.html',
  styleUrls: ['./dialog-aprovar-abono.component.scss']
})
export class DialogAprovarAbonoComponent implements OnInit {

  public observacao;
  public manifestacao: any;
  public anexarNovamente: any;
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogAprovarAbonoComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private _service: AbonoService,
              private _emitirEventoService: EmitirEventoService) { }




  ngOnInit() {
    this._buildForm();
    console.log(this.data)
  }

  _buildForm() {
    this.form = new FormGroup({
      'abonar': new FormControl(true)
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  aprovarAtestadoMedicoOrOutrasFaltas(): void {
    let obj = this.obj();
    console.log(obj);
    this._service.aprovarAtestadoMedicoOrOutrasFaltas(obj).pipe(take(1)).subscribe(val => {
      HelperFrequencia.showNotification('Horas abonadas aprovadas com sucesso', AlertType.Success);
      this.onNoClick();
      this._emitirEventoService.emitir("abono", "abono");
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }

  aprovar(): void {
    let obj = {} as any;
    obj.id = this.data.obj.id;
    obj.matricula = this.data.obj.matricula;
    obj.manifestacao = this.form.controls['abonar'].value;
    obj.observacao = this.observacao;
    this._service.aprovar(obj).pipe(take(1)).subscribe(val => {
      HelperFrequencia.showNotification('Horas abonadas aprovadas com sucesso', AlertType.Success);
      this.onNoClick();
      this._emitirEventoService.emitir("abono", "abono");
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }


  obj() {
    let obj = this.data.obj;
    obj.idFrequencia = this.data.obj.idFrequencia;
    obj.observacao = this.data.obj.observacao;
    obj.manifestacao = this.form.controls['abonar'].value;
    return obj;
  }


}
