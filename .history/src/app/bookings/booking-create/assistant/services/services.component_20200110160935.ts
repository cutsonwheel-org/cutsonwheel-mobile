import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Users } from 'src/app/users/users';
import { Observable } from 'rxjs';
import { Offers } from 'src/app/services/offers/offers';
import { OffersService } from 'src/app/services/offers/offers.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  @Input() assistantId: string;
  @ViewChild('f', { static: false }) form: NgForm;

  public offers$: Observable<Offers[]>;
  // navParams: NavParams
  constructor(
    private modalCtrl: ModalController,
    private offersService: OffersService
  ) { }

  ngOnInit() {
    console.log(this.assistantId);
    this.offers$ = this.offersService.getByUserId(this.assistantId);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onPickedService(offerId: string) {
    console.log(offerId);
    if (!this.form.valid) {
      return;
    }
    this.modalCtrl.dismiss(
      {
        selectedOffer: offerId
      },
      'confirm'
    );
  }
  // onPickedService(serviceId: string) {
  //   this.isSelectedOffer = true;

  //   this.offersService.getOne(serviceId).subscribe((offer) => {
  //     const assistantData = {
  //       assisstantId: offer.userId,
  //       offerId: offer.id
  //     };
  //     localStorage.setItem('assistant', JSON.stringify(assistantData));
  //     this.prePopulateAssistant(assistantData);
  //     this.isNextAssistant = false;
  //   });
  // }
}
