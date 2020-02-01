import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { Observable } from 'rxjs';
import { Users } from 'src/app/users/users';
import { Offers } from 'src/app/services/offers/offers';
import { OffersService } from 'src/app/services/offers/offers.service';

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

  assistant: Assistant;
  assistantId: string;
  userInfo: Users;
  offerInfo: Offers;
  isNextAssistant = true;
  isSelectedAssistant = false;
  isSelectedOffer = false;

  constructor(
    private usersService: UsersService,
    private offersService: OffersService
  ) { }

  ngOnInit() {
    this.assistants$ = this.usersService.getByAssistant();
  }

  onPickedAssistant(userId: string) {
    this.isSelectedAssistant = true;
    this.offers$ = this.offersService.getByUserId(userId);
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

}
