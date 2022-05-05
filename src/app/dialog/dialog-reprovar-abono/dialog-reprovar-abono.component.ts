import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AbonoService } from 'app/service/abono.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-reprovar-abono',
  templateUrl: './dialog-reprovar-abono.component.html',
  styleUrls: ['./dialog-reprovar-abono.component.scss']
})
export class DialogReprovarAbonoComponent implements OnInit {

  public observacao;
  public manifestacao: any;
  public anexarNovamente: any;
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogReprovarAbonoComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private _service: AbonoService,
              private _emitirEventoService: EmitirEventoService) { }




  ngOnInit() {
    this._buildForm();
  }

  _buildForm() {
    this.form = new FormGroup({
      'anexarNovamente': new FormControl(true)
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  reprovar() {
    if(!this.observacao){
      HelperFrequencia.showNotification('O campo observação é obrigatório!', AlertType.Error);
      return false;
    }
    let obj = {} as any;
    obj.id = this.data.obj.id;
    obj.matricula = this.data.obj.matricula;
    obj.observacao = this.observacao;
    obj.anexarNovamente = this.form.controls['anexarNovamente'].value;
    this._service.reprovar(obj).pipe(take(1)).subscribe(val => {
      HelperFrequencia.showNotification('Horas abonadas reprovadas com sucesso', AlertType.Success);
      this.onNoClick();
      this._emitirEventoService.emitir("abono", "abono");
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }

}
