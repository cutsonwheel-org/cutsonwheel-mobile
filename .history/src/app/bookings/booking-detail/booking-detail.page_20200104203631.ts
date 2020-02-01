import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private bookingsService: BookingsService,
    private offersService: OffersService,
    private usersService: UsersService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('bookingId')) {
        this.navCtrl.navigateBack('/t/bookings');
        return;
      }
      this.isLoading = true;
      this.bookingsService.getBooking(paramMap.get('bookingId')).pipe(
        map( bookings => {
          this.bookings = bookings;
          return bookings;
        }),
        mergeMap( booking => {
          const offer = this.offersService.getOffer(booking.assistant.offerId);
          const assistant = this.usersService.getUser(booking.assistant.assisstantId);
          const client = this.usersService.getUser(booking.userId);
          return forkJoin([offer, assistant, client]);
        })
      ).subscribe((details) => {
        this.usersService.getUser(this.authService.getUsersProfile().uid).subscribe((user) => {
          const assistantName = details[1].firstname + ' ' + details[1].lastname;
          const assistantAvatar = details[1].avatarUrl;
          const clientName = details[2].firstname + ' ' + details[2].lastname;
          const clientAvatar = details[2].avatarUrl;
          this.fullname = (user.role === 'assistant') ? clientName : assistantName;
          this.avatar = (user.role === 'assistant') ? clientAvatar : assistantAvatar;
          this.lbl = (user.role === 'assistant') ? 'Client' : 'Assistant';
        });

        this.isLoading = false;
        this.offer = details[0];
        // this.assistant = details[1];
        // this.client = details[2];
        const bookingDetail = {
          ...this.offer,
          // ...this.assistant,
          // ...this.client,
          ...this.bookings
        };
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

  onConfirmed() {
    console.log('confirm');
  }

  onCanceled() {
    console.log('cancel');
  }
}
