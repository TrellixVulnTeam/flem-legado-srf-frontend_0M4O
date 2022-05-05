import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AbonoService } from 'app/service/abono.service';
import { EmitirEventoService } from 'app/service/emitir-evento.service';
import { HelperFrequencia } from 'app/helper/helper-frequencia';
import { take } from 'rxjs/operators';
import { AlertType } from 'app/model/alert-type';

@Component({
  selector: 'app-dialog-reabrir-abono',
  templateUrl: './dialog-reabrir-abono.component.html',
  styleUrls: ['./dialog-reabrir-abono.component.scss']
})
export class DialogReabrirAbonoComponent implements OnInit {

  public observacao;
  
  constructor(public dialogRef: MatDialogRef<DialogReabrirAbonoComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _service: AbonoService,
    private _emitirEventoService: EmitirEventoService) { }

  ngOnInit() {
  }

  
  onNoClick(): void {
    this.dialogRef.close();
  }

  reabrir() {
    if(!this.observacao){
      HelperFrequencia.showNotification('O campo observação é obrigatório!', AlertType.Error);
      return false;
    }
    let obj = {} as any;
    obj.id = this.data.obj.id;
    obj.matricula = this.data.obj.matricula;
    obj.observacao = this.observacao;
    this._service.reabrir(obj).pipe(take(1)).subscribe(val => {
      HelperFrequencia.showNotification('Horas reabertas com sucesso', AlertType.Success);
      this.onNoClick();
      this._emitirEventoService.emitir("abono", "abono");
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }

}
