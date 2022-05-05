import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AbonoService } from 'app/service/abono.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { FormGroup, FormControl } from '@angular/forms';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { AlertType } from 'app/model/alert-type';
import { take } from 'rxjs/operators';
import { UserDataService } from 'app/service/user-data.service';

@Component({
  selector: 'app-dialog-reprovar-abono-lote',
  templateUrl: './dialog-reprovar-abono-lote.component.html',
  styleUrls: ['./dialog-reprovar-abono-lote.component.scss']
})
export class DialogReprovarAbonoLoteComponent implements OnInit {

  public observacao;
  public manifestacao: any;
  public anexarNovamente: any;
  form: FormGroup;


  constructor(public dialogRef: MatDialogRef<DialogReprovarAbonoLoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _service: AbonoService,
    private _emitirEventoService: EmitirEventoService,
    private _user: UserDataService) { }


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
    if (!this.observacao) {
      HelperFrequencia.showNotification('O campo observação é obrigatório!', AlertType.Error);
      return false;
    }
    let array = [];
    this.data.array.forEach(element => {
      if (element.tipo == 'Falta Médica') {
        array.push({
          id: element.id,
          observacao: this.observacao,
          anexarNovamente: this.form.controls['anexarNovamente'].value
        });
      } else {
        array.push({ 
          id: element.id, 
          observacao: this.observacao,
          anexarNovamente: false});
      }

    });
    console.log(array);
    
    this._service.reprovarEmLote(array).pipe(take(1)).subscribe(val => {
      HelperFrequencia.showNotification('Horas abonadas reprovadas com sucesso', AlertType.Success);
      this.onNoClick();
      this._emitirEventoService.emitir("abono", "abono");
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }

  hasPermission(permission) {
    return this._user.hasPermission(permission);
  }


}
