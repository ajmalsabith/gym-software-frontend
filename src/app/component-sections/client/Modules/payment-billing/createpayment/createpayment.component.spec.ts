import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepaymentComponent } from './createpayment.component';

describe('CreatepaymentComponent', () => {
  let component: CreatepaymentComponent;
  let fixture: ComponentFixture<CreatepaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatepaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatepaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
