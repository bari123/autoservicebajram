import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCarsComponent } from './client-cars.component';

describe('ClientCarsComponent', () => {
  let component: ClientCarsComponent;
  let fixture: ComponentFixture<ClientCarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCarsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
