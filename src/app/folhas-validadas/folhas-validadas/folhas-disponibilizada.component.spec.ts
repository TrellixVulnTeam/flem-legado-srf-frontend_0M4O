import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolhasDisponibilizadaComponent } from './folhas-disponibilizada.component';

describe('FolhasValidadasComponent', () => {
  let component: FolhasDisponibilizadaComponent;
  let fixture: ComponentFixture<FolhasDisponibilizadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolhasDisponibilizadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolhasDisponibilizadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
