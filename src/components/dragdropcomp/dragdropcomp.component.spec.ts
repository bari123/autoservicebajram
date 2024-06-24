import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragdropcompComponent } from './dragdropcomp.component';

describe('DragdropcompComponent', () => {
  let component: DragdropcompComponent;
  let fixture: ComponentFixture<DragdropcompComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DragdropcompComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragdropcompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
