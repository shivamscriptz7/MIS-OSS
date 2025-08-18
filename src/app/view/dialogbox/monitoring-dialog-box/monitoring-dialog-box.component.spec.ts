import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringDialogBoxComponent } from './monitoring-dialog-box.component';

describe('MonitoringDialogBoxComponent', () => {
  let component: MonitoringDialogBoxComponent;
  let fixture: ComponentFixture<MonitoringDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringDialogBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
