import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringGraphViewComponent } from './monitoring-graph-view.component';

describe('MonitoringGraphViewComponent', () => {
  let component: MonitoringGraphViewComponent;
  let fixture: ComponentFixture<MonitoringGraphViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitoringGraphViewComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MonitoringGraphViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
