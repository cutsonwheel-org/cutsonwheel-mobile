import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabsPagePage } from './tabs-page.page';

describe('TabsPagePage', () => {
  let component: TabsPagePage;
  let fixture: ComponentFixture<TabsPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
