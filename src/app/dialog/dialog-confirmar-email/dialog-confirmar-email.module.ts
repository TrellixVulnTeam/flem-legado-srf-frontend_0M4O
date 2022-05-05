import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogConfirmarEmailComponent } from './dialog-confirmar-email.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [DialogConfirmarEmailComponent],
  entryComponents: [DialogConfirmarEmailComponent]
})
export class DialogConfirmarEmailModule { }
