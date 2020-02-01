import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookingCreatePage } from './booking-create.page';

describe('BookingCreatePage', () => {
  let component: BookingCreatePage;
  let fixture: ComponentFixture<BookingCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingCreatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
