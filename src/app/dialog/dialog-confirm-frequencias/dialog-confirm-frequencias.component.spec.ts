import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmFrequenciasComponent } from './dialog-confirm-frequencias.component';

describe('DialogConfirmFrequenciasComponent', () => {
  let component: DialogConfirmFrequenciasComponent;
  let fixture: ComponentFixture<DialogConfirmFrequenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConfirmFrequenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmFrequenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
