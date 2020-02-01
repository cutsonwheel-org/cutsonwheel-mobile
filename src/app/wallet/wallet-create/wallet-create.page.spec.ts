import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WalletCreatePage } from './wallet-create.page';

describe('WalletCreatePage', () => {
  let component: WalletCreatePage;
  let fixture: ComponentFixture<WalletCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WalletCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WalletCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
