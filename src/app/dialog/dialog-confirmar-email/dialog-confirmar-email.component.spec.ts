import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmarEmailComponent } from './dialog-confirmar-email.component';

describe('DialogConfirmarEmailComponent', () => {
  let component: DialogConfirmarEmailComponent;
  let fixture: ComponentFixture<DialogConfirmarEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogConfirmarEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmarEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
