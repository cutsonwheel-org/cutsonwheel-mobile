import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfferCreatePage } from './offer-create.page';

describe('OfferCreatePage', () => {
  let component: OfferCreatePage;
  let fixture: ComponentFixture<OfferCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
