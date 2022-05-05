import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHistoricoArquivoComponent } from './dialog-historico-arquivo.component';

describe('DialogHistoricoArquivoComponent', () => {
  let component: DialogHistoricoArquivoComponent;
  let fixture: ComponentFixture<DialogHistoricoArquivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHistoricoArquivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHistoricoArquivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
