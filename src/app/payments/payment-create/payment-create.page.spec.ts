import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentCreatePage } from './payment-create.page';

describe('PaymentCreatePage', () => {
  let component: PaymentCreatePage;
  let fixture: ComponentFixture<PaymentCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
