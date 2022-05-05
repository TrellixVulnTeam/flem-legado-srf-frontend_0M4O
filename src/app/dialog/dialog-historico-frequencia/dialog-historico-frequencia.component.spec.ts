import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHistoricoFrequenciaComponent } from './dialog-historico-frequencia.component';

describe('DialogHistoricoFrequenciaComponent', () => {
  let component: DialogHistoricoFrequenciaComponent;
  let fixture: ComponentFixture<DialogHistoricoFrequenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogHistoricoFrequenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHistoricoFrequenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
