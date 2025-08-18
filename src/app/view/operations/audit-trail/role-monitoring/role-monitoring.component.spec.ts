import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMonitoringComponent } from './role-monitoring.component';

describe('RoleMonitoringComponent', () => {
  let component: RoleMonitoringComponent;
  let fixture: ComponentFixture<RoleMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleMonitoringComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
