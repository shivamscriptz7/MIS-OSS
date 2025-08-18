import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateUserRoleComponent } from './add-update-user-role.component';

describe('AddUpdateUserRoleComponent', () => {
  let component: AddUpdateUserRoleComponent;
  let fixture: ComponentFixture<AddUpdateUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateUserRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
