import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipClearComponent } from './membership-clear.component';

describe('MembershipClearComponent', () => {
  let component: MembershipClearComponent;
  let fixture: ComponentFixture<MembershipClearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipClearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipClearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
