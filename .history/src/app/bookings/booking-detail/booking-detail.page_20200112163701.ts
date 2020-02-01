import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { BookingsService } from '../bookings.service';
import { Bookings } from '../bookings';
import { UsersService } from 'src/app/users/users.service';
import { map, mergeMap } from 'rxjs/operators';
import { OffersService } from 'src/app/services/offers/offers.service';
import { forkJoin } from 'rxjs';
import { Offers } from 'src/app/services/offers/offers';
import { Users } from 'src/app/users/users';
import { AuthService } from 'src/app/auth/auth.service';

interface Schedule {
  datePicked: string;
  timePicked: string;
}

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit {
  bookings: Bookings;
  isLoading = false;
  detail: any;
  schedule: Schedule;
  offer: Offers;
  assistant: Users;
  client: Users;

  fullname: string;
  avatar: string;
  lbl: string;
  assistantRole: boolean;
  clientRole: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private bookingsService: BookingsService,
    private offersService: OffersService,
    private usersService: UsersService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('bookingId')) {
        this.navCtrl.navigateBack('/t/bookings');
        return;
      }
      this.isLoading = true;
      this.bookingsService.getOne(paramMap.get('bookingId')).pipe(
        map( bookings => {
          this.bookings = bookings;
          return bookings;
        }),
        mergeMap( booking => {
          const assistant = this.usersService.getUser(booking.assistant.assisstantId);
          const client = this.usersService.getUser(booking.userId);
          return forkJoin([assistant, client]);
        })
      ).subscribe((details) => {
        this.usersService.getUser(this.authService.getUsersProfile().uid).subscribe((user) => {
          const assistantName = details[0].firstname + ' ' + details[0].lastname;
          const assistantAvatar = details[0].photoURL;
          const clientName = details[1].firstname + ' ' + details[1].lastname;
          const clientAvatar = details[1].photoURL;
          this.fullname = (user.roles.assistant) ? clientName : assistantName;
          this.avatar = (user.roles.assistant) ? clientAvatar : assistantAvatar;
          this.lbl = (user.roles.assistant) ? 'Client' : 'Assistant';
          this.assistantRole = user.roles.assistant;
          this.clientRole = user.roles.client;
        });

        this.isLoading = false;

        this.assistant = details[0];
        this.client = details[1];
        const bookingDetail = {
          ...this.assistant,
          ...this.client,
          ...this.bookings
        };
        console.log(bookingDetail);
        this.detail = bookingDetail;
      },
      error => {
        this.alertCtrl
          .create({
            header: 'An error ocurred!',
            message: 'Could not load booking.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/t/bookings']);
                }
              }
            ]
          })
          .then(alertEl => alertEl.present());
      });
    });
  }

  onViewLocation(lat: number, lng: number) {
    console.log(lat + '-' + lng);
  }

  onUpdateStatus(bookingId: string, bookingStatus: string) {
    this.loadingCtrl
      .create({
        message: 'Updating status...'
      })
      .then(loadingEl => {
        loadingEl.present();
        const booking  = {
          id: bookingId,
          status: bookingStatus
        };
        this.bookingsService.update(booking).then(() => {
            loadingEl.dismiss();
            localStorage.clear();
            if (bookingStatus === 'done') {
              localStorage.setItem('bookingId', bookingId);
              this.router.navigateByUrl('/t/payments/payment-create');
            } else {
              this.router.navigateByUrl('/t/bookings');
            }
        });
      });
  }

}
