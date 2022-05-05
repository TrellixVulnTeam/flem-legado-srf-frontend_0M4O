import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContatosComponent } from './add-contatos.component';

describe('AddContatosComponent', () => {
  let component: AddContatosComponent;
  let fixture: ComponentFixture<AddContatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddContatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
