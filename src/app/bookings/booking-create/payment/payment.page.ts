import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users/users.service';
import { LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingsService } from '../../bookings.service';

interface Assistant {
  assisstantId: string;
  selectedServices: any[];
  subTotal: number;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  assistant: Assistant;

  mapping: {[k: string]: string} = {
    '=0': 's',
    '=1': '',
    other: 's',
  };

  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private bookingsService: BookingsService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    // get assistant
    this.assistant = this.getAssistant();
  }

  onConfirmed() {
    this.loadingCtrl
      .create({
        message: 'Creating your booking...'
      })
      .then(loadingEl => {
        loadingEl.present();
        const user = this.authService.getUsersProfile();
        const booking  = {
          userId: user.uid,
          location: this.getLocation(),
          assistant: this.getAssistant(),
          schedule: this.getSchedule(),
          status: 'pending'
        };
        this.bookingsService.insert(booking).then(() => {
            loadingEl.dismiss();
            localStorage.clear();
            this.navCtrl.navigateBack('/t/bookings');
        });
      });
  }

  onCancel() {
    localStorage.clear();
    this.navCtrl.navigateBack('/t/services/discover');
  }

  private getLocation() {
    return JSON.parse(localStorage.getItem('location'));
  }

  private getAssistant() {
    return JSON.parse(localStorage.getItem('assistant'));
  }

  private getSchedule() {
    return JSON.parse(localStorage.getItem('schedule'));
  }
}
