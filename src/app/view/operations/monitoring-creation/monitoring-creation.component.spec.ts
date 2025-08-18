import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringCreationComponent } from './monitoring-creation.component';

describe('MonitoringCreationComponent', () => {
  let component: MonitoringCreationComponent;
  let fixture: ComponentFixture<MonitoringCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonitoringCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonitoringCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
