import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { BookingsService } from '../bookings.service';
import { Bookings } from '../bookings';
import { UsersService } from 'src/app/users/users.service';
import { map, mergeMap } from 'rxjs/operators';
import { OffersService } from 'src/app/services/offers/offers.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit {
  bookings: Bookings;
  isLoading = false;
  userInfo: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private bookingsService: BookingsService,
    private offersService: OffersService,
    private usersService: UsersService,
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
          return bookings;
        }),
        mergeMap( booking => this.offersService.getOffer(booking.assistant.offerId))
      ).subscribe((details) => {
        console.log(details);
      });

      this.bookingsService.getBooking(paramMap.get('bookingId')).subscribe(booking => {
        this.isLoading = false;

        this.bookings = booking;

        this.usersService.getUser(booking.userId).subscribe((assistant) => {
          // this.assistantDetail = assistant;
        });
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

}
