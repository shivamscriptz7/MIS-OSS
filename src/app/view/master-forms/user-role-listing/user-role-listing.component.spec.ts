import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleListingComponent } from './user-role-listing.component';

describe('UserRoleListingComponent', () => {
  let component: UserRoleListingComponent;
  let fixture: ComponentFixture<UserRoleListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRoleListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRoleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
