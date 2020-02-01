import { Component, OnInit } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { UsersService } from 'src/app/users/users.service';
import { Observable } from 'rxjs';
import { Users } from 'src/app/users/users';
import { Offers } from 'src/app/services/offers/offers';
import { OffersService } from 'src/app/services/offers/offers.service';
import { ModalController } from '@ionic/angular';
import { ServicesComponent } from './services/services.component';

interface Assistant {
  assisstantId: string;
  offerId: string;
}

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.page.html',
  styleUrls: ['./assistant.page.scss'],
})
export class AssistantPage implements OnInit {
  public assistants$: Observable<Users[]>;
  public offers$: Observable<Offers[]>;
  public isLoading: boolean;

  assistant: Assistant;
  assistantId: string;
  userInfo: Users;
  offerInfo: Offers;
  isNextAssistant = true;
  isSelectedAssistant = false;
  isSelectedOffer = false;

  // get offersData(userId: string) {
  //   return this.offersService.getByUserId(userId);
  // }

  get assitantData() {
    return this.usersService.getByAssistant('');
  }

  constructor(
    private usersService: UsersService,
    private offersService: OffersService,
    private modalCtrl: ModalController
  ) {
    this.isLoading = true;
   }

  ngOnInit() {
    this.assistants$ = this.assitantData;
    if (this.assistants$) {
      this.isLoading = false;
    }
  }

  ionViewWillEnter() {
    this.assistants$ = this.assitantData;
  }

  onPickedAssistant(userId: string) {
    this.modalCtrl.create({
        component: ServicesComponent,
        componentProps: {
          user: this.usersService.getUser(userId)
        }
      }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        // if should return service selected
        console.log(modalData.data);
      });
      modalEl.present();
    });
  }

  getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }

  prePopulateAssistant(assistant: Assistant) {
    this.usersService.getUser(assistant.assisstantId).subscribe((user) => {
      this.userInfo = user;
    });

    this.offersService.getOne(assistant.offerId).subscribe((offer) => {
      this.offerInfo = offer;
    });
  }

  onPickedService(serviceId: string) {
    this.isSelectedOffer = true;

    this.offersService.getOne(serviceId).subscribe((offer) => {
      const assistantData = {
        assisstantId: offer.userId,
        offerId: offer.id
      };
      localStorage.setItem('assistant', JSON.stringify(assistantData));
      this.prePopulateAssistant(assistantData);
      this.isNextAssistant = false;
    });
  }

  onClear(ev: any) {
    this.assistants$ = this.assitantData;
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    const searchTerm = event.detail.value;
    if (!searchTerm) {
      this.assistants$ = this.assitantData;
    }
    this.assistants$ = this.usersService.getByAssistant(searchTerm);
  }


}
