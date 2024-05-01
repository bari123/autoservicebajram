import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsHistoryComponent } from './clients-history.component';

describe('ClientsHistoryComponent', () => {
  let component: ClientsHistoryComponent;
  let fixture: ComponentFixture<ClientsHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
