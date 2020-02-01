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
  selectedServices = [];
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

  selectService(ev: CustomEvent) {

    console.log(ev.detail.value);
    if (ev.detail.checked) {
      this.selectedServices.push(ev.detail.value);
    }
  }

  onSelectService() {
    localStorage.setItem('services', JSON.stringify(this.selectedServices));
    console.log(this.selectedServices);

    const input = this.getServices();
    let total =  0;
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < input.length; index++) {
      const element = input[index];
      if (isNaN(element.charges)) {
        continue;
      }
      total += Number(element.charges);
    }
    console.log(total);
    // return total;
  }

  onPickedService(offerId: string) {
    // console.log(offerId);
    // this.modalCtrl.dismiss(
    //   {
    //     offerId
    //   },
    //   'confirm'
    // );
  }

  private getServices() {
    return JSON.parse(localStorage.getItem('services'));
  }

  private getSum(input) {
    // [{id: "2JTdommrh0NklfbAMMzO", availability: "alldays", category: "Haircut", charges: 450,…},…]
    // 0: {id: "2JTdommrh0NklfbAMMzO", availability: "alldays", category: "Haircut", charges: 450,…}
    // id: "2JTdommrh0NklfbAMMzO"
    // availability: "alldays"
    // category: "Haircut"
    // charges: 450
    // description: "The slicked back undercut hairstyle is a trendy mix of classic and modern styles. It works best with medium-length hair, and styling is as simple as blow-drying your hair back while using a brush to control the direction. Finishing with a matte pomade will hold this style in place all day or night."
    // duration: "45 minutes"
    // imageUrl: "https://firebasestorage.googleapis.com/v0/b/cutsonwheel-233209.appspot.com/o/images%2Fee1e14d3-d260-40b1-9946-23d3fa546b66-Slicked-Back-Undercut.jpg?alt=media&token=ee1e14d3-d260-40b1-9946-23d3fa546b66"
    // title: "Slicked Back Undercut Hairstyle For Men"
    // userId: "TkEi7nAOj0ZzN08qaUeQSCXq88d2"
    // 1: {id: "5HpSlNMNxuxm64U3QpS0", availability: "alldays", category: "Haircut", charges: 450,…}
    // id: "5HpSlNMNxuxm64U3QpS0"
    // availability: "alldays"
    // category: "Haircut"
    // charges: 450
    // description: "If you’re a fan of modern messy styles, this thick medium-length look is sure to be a hit. The length in the front gives your style some personality, and the medium taper adds some classic edge. It’s just as suitable for a day at work as a pub crawl, and when paired with a thick, full beard, it oozes sex appeal."
    // duration: "50 minutes"
    // imageUrl: "https://firebasestorage.googleapis.com/v0/b/cutsonwheel-233209.appspot.com/o/images%2F5e67b7b5-e549-402a-9cb1-c0416be35f0e-Messy-Taper-Hairstyle.jpg?alt=media&token=5e67b7b5-e549-402a-9cb1-c0416be35f0e"
    // title: "Messy Taper Hairstyle"
    // userId: "TkEi7nAOj0ZzN08qaUeQSCXq88d2"
    if (toString.call(input) !== '[object Array]') {
      return false;
    }

    let total =  0;
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < input.length; index++) {
      if (isNaN(input[index])) {
        continue;
      }
      total += Number(input[index]);
    }

    return total;
  }
}
