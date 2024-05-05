import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCarInfoComponent } from './client-car-info.component';

describe('ClientCarInfoComponent', () => {
  let component: ClientCarInfoComponent;
  let fixture: ComponentFixture<ClientCarInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCarInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
