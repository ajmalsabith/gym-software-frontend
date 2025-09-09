import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignMembershipComponent } from './assign-membership.component';

describe('AssignMembershipComponent', () => {
  let component: AssignMembershipComponent;
  let fixture: ComponentFixture<AssignMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignMembershipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
