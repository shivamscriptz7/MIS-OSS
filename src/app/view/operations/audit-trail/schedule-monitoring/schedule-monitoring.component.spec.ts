import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMonitoringComponent } from './schedule-monitoring.component';

describe('ScheduleMonitoringComponent', () => {
  let component: ScheduleMonitoringComponent;
  let fixture: ComponentFixture<ScheduleMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
