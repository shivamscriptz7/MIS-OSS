import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessMonitoringComponent } from './process-monitoring.component';

describe('ProcessMonitoringComponent', () => {
  let component: ProcessMonitoringComponent;
  let fixture: ComponentFixture<ProcessMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
