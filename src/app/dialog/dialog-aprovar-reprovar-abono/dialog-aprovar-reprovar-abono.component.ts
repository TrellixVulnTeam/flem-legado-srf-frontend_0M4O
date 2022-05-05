import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AbonoService } from '../../service/abono.service';
import { AlertType } from '../../model/alert-type';
import { HelperFrequencia } from '../../helper/helper-frequencia';
import { EmitirEventoService } from '../../service/emitir-evento.service';
import { UserDataService } from '../../service/user-data.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-aprovar-reprovar-abono',
  templateUrl: './dialog-aprovar-reprovar-abono.component.html',
  styleUrls: ['./dialog-aprovar-reprovar-abono.component.scss']
})
export class DialogAprovarReprovarAbonoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogAprovarReprovarAbonoComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private abono: AbonoService,
    private emitirEventoService: EmitirEventoService,
    private user: UserDataService) { }

  public manifestacao: any;
  public anexarNovamente: any;

  ngOnInit() {
    this.manifestacao = '1';
    this.anexarNovamente = '1';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  aprovar(): void {
    this.approveOrDisapproveAdd(true);
  }

  reprovar() {
    if (!this.data.obj.observacao) {
      HelperFrequencia.showNotification("Por favor preencha o campo observação", AlertType.Error);
      return false;
    } else {
      this.approveOrDisapproveAdd(false);
    }
  }

  approveOrDisapproveAdd(validado: boolean): void {

    let obj: any = {};
    if (validado) {
      obj.tipo = 'aprovadas';
      obj.pathLocal = 'aprovar';
    } else {
      obj.tipo = 'reprovadas';
      obj.pathLocal = 'reprovar';
    }
    this.enviar(obj);
  }
  // metodo que aprova e reprova os abonos
  enviar(obj): void {
    this.setData();
    if (this.data.obj && this.data.obj.id) {
      this.abono.approveOrDisapprove(obj.pathLocal, this.data.obj).subscribe(val => {
        HelperFrequencia.showNotification('Horas abonadas ' + obj.tipo + ' com sucesso', AlertType.Success);
        this.onNoClick();
        // console.log(this.emitirEventoService);
        this.emitirEventoService.emitir("abono", "abono");
      }, error => {
        HelperFrequencia.showNotification(error.error.message, AlertType.Error);
      });
    }
  }

  setData(): void {
    this.data.obj.usuarioValidador = this.user.matricula();
    this.data.obj.hrTrabalhadas = null;
    this.data.obj.status = null;
  }

  aprovarAtestadoMedicoOrOutrasFaltas(): void {
    let obj = this.obj();
    this.abono.aprovarAtestadoMedicoOrOutrasFaltas(obj).pipe(take(1)).subscribe(val => {
      HelperFrequencia.showNotification('Horas abonadas aprovadas com sucesso', AlertType.Success);
      this.onNoClick();
      this.emitirEventoService.emitir("abono", "abono");
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }


  reprovarAtestadoMedicoOrOutrasFaltas() {
    if (!this.data.obj.observacao) {
      HelperFrequencia.showNotification("Por favor preencha o campo observação", AlertType.Error);
      return false;
    }
    let obj = this.obj();
    this.abono.reprovarAtestadoMedicoOrOutrasFaltas(obj).pipe(take(1)).subscribe(val => {
      HelperFrequencia.showNotification('Horas abonadas aprovadas com sucesso', AlertType.Success);
      this.onNoClick();
      this.emitirEventoService.emitir("abono", "abono");
    }, error => {
      HelperFrequencia.showNotification(error.error.message, AlertType.Error);
    });
  }



  obj() {
    let obj = this.data.obj;
    obj.idFrequencia = this.data.idFrequencia;
    obj.observacao = this.data.obj.observacao;
    obj.manifestacao = this.manifestacao == '1' ? true : false;
    obj.anexarNovamente = this.anexarNovamente == '1' ? true : false;
    return obj;
  }


}
