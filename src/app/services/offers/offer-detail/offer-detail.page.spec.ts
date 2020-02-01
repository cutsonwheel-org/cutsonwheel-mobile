import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OfferDetailPage } from './offer-detail.page';

describe('OfferDetailPage', () => {
  let component: OfferDetailPage;
  let fixture: ComponentFixture<OfferDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
