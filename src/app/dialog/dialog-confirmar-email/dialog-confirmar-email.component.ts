import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-confirmar-email',
  templateUrl: './dialog-confirmar-email.component.html',
  styleUrls: ['./dialog-confirmar-email.component.scss']
})

export class DialogConfirmarEmailComponent implements OnInit {

  mensagemConfirmacao: String = "";

  constructor(public dialogRef: MatDialogRef<DialogConfirmarEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.mensagemConfirmacao = data.mensagem;
    }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
