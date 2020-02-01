import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Users } from 'src/app/users/users';
import { Observable } from 'rxjs';
import { Offers } from 'src/app/services/offers/offers';
import { OffersService } from 'src/app/services/offers/offers.service';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  @Input() assistantId: string;
  @ViewChild('f', { static: false }) form: NgForm;

  public user: any;
  public offers$: Observable<Offers[]>;
  selectedServices: any[];
  // navParams: NavParams
  constructor(
    private modalCtrl: ModalController,
    private offersService: OffersService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.usersService.getUser(this.assistantId).subscribe((user) => {
      this.user = user;
    });

    this.offers$ = this.offersService.getByUserId(this.assistantId);
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onSelectService(ev: CustomEvent) {
    if (ev.detail.checked) {
      this.selectedServices.push(ev.detail.value);
    }
    console.log(this.selectedServices);
  }

  onPickedService(offerId: string) {
    console.log(offerId);
    // this.modalCtrl.dismiss(
    //   {
    //     offerId
    //   },
    //   'confirm'
    // );
  }
}
