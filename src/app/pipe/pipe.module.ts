import { NgModule } from '@angular/core';
import { GroupByPipe } from './group-by.pipe';
import { BooleanPipe } from './boolean.pipe';

@NgModule({
  declarations: [
    GroupByPipe,
    BooleanPipe
  ],
  imports: [],
  exports: [
    GroupByPipe,
    BooleanPipe
  ]
})
export class PipeModule { }
