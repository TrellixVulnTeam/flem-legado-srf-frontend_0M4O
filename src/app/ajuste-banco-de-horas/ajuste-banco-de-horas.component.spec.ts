import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjusteBancoDeHorasComponent } from './ajuste-banco-de-horas.component';

describe('AjusteBancoDeHorasComponent', () => {
  let component: AjusteBancoDeHorasComponent;
  let fixture: ComponentFixture<AjusteBancoDeHorasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjusteBancoDeHorasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjusteBancoDeHorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
