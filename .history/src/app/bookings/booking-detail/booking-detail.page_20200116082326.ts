import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { BookingsService } from '../bookings.service';
import { Bookings } from '../bookings';
import { UsersService } from 'src/app/users/users.service';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { OffersService } from 'src/app/services/offers/offers.service';
import { forkJoin, Subscription, of } from 'rxjs';
import { Offers } from 'src/app/services/offers/offers';
import { Users } from 'src/app/users/users';
import { AuthService } from 'src/app/auth/auth.service';
import { Misc } from './../../shared/class/misc';
import { DirectionsComponent } from 'src/app/shared/components/directions/directions.component';

interface Schedule {
  datePicked: string;
  timePicked: string;
}

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.page.html',
  styleUrls: ['./booking-detail.page.scss'],
})
export class BookingDetailPage implements OnInit, OnDestroy {
  bookings: Bookings;
  isLoading = false;
  detail: any;
  offer: Offers;
  assistant: Users;
  client: Users;
  users: Users;
  user: firebase.User;
  pickedSchedule: Date;

  private bookingSub: Subscription;
  private routeSub: Subscription;
  private userSub: Subscription;
  private authSub: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private bookingsService: BookingsService,
    private usersService: UsersService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private router: Router
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    // get user current state
    this.authSub = this.authService.getUserState().pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.usersService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe( profile => {
      this.users = profile;
    });

    this.routeSub = this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('bookingId')) {
        this.navCtrl.navigateBack('/t/bookings');
        return;
      }

      // this.getBooking(paramMap.get('bookingId'));
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

        this.isLoading = false;

        this.usersService.getUser(this.authService.getUsersProfile().uid)
          .subscribe((user) => {
            this.users = user;
            this.users.displayName = (user.roles.assistant) ? details[1].displayName : details[0].displayName;
            this.users.photoURL = (user.roles.assistant) ? details[1].photoURL : details[0].photoURL;
            this.users.roles.assistant = user.roles.assistant;
            this.users.roles.client = user.roles.client;

            const assistantDetail = details[0];
            const clientDetail = details[1];

            const bookingDetail = {
              assistantDetail,
              clientDetail,
              ...this.bookings
            };

            const timePicked = bookingDetail.schedule.timePicked;
            const scheduleDate = new Date(bookingDetail.schedule.datePicked);

            this.pickedSchedule = new Misc().mergeDateTime(scheduleDate, timePicked);

            this.detail = bookingDetail;
          }
        );

        // this.getUser(details);

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

  private getBooking(bookingId: string) {
    this.bookingSub = this.bookingsService.getOne(bookingId).pipe(
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

      this.isLoading = false;

      this.usersService.getUser(this.authService.getUsersProfile().uid)
        .subscribe((user) => {
          this.users = user;
          this.users.displayName = (user.roles.assistant) ? details[1].displayName : details[0].displayName;
          this.users.photoURL = (user.roles.assistant) ? details[1].photoURL : details[0].photoURL;
          this.users.roles.assistant = user.roles.assistant;
          this.users.roles.client = user.roles.client;

          const assistantDetail = details[0];
          const clientDetail = details[1];

          const bookingDetail = {
            assistantDetail,
            clientDetail,
            ...this.bookings
          };

          const timePicked = bookingDetail.schedule.timePicked;
          const scheduleDate = new Date(bookingDetail.schedule.datePicked);

          this.pickedSchedule = new Misc().mergeDateTime(scheduleDate, timePicked);

          this.detail = bookingDetail;
        }
      );

      // this.getUser(details);

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
  }

  private getUser(details: any) {
    this.userSub = this.usersService.getUser(this.authService.getUsersProfile().uid)
      .subscribe((user) => {
        this.users.displayName = (user.roles.assistant) ? details[1].displayName : details[0].displayName;
        this.users.photoURL = (user.roles.assistant) ? details[1].photoURL : details[0].photoURL;
        this.users.roles.assistant = user.roles.assistant;
        this.users.roles.client = user.roles.client;

        const assistantDetail = details[0];
        const clientDetail = details[1];

        const bookingDetail = {
          assistantDetail,
          clientDetail,
          ...this.bookings
        };

        const timePicked = bookingDetail.schedule.timePicked;
        const scheduleDate = new Date(bookingDetail.schedule.datePicked);

        this.pickedSchedule = new Misc().mergeDateTime(scheduleDate, timePicked);

        this.detail = bookingDetail;
      }
    );
  }

  onViewLocation(lat: number, lng: number) {
    console.log(lat + '-' + lng);
    this.modalCtrl.create({ component: DirectionsComponent })
      .then(modalEl => {
        // modalEl.onDidDismiss()
        //   .then(modalData => {
        //     if (!modalData.data) {
        //       return;
        //     }
        //     const coordinates: Coordinates = {
        //       lat: modalData.data.lat,
        //       lng: modalData.data.lng
        //     };
        //     this.createPlace(coordinates.lat, coordinates.lng);
        //   }
        // );
        modalEl.present();
      }
    );
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

  ngOnDestroy() {
    this.bookingSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.userSub.unsubscribe();
    this.authSub.unsubscribe();
  }
}
