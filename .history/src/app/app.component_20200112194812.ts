import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

import { Plugins, Capacitor } from '@capacitor/core';
import { switchMap } from 'rxjs/operators';
import { UsersService } from './users/users.service';
import { Observable, of, Subscription } from 'rxjs';
import { OffersService } from './services/offers/offers.service';
import { BookingsService } from './bookings/bookings.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  user: firebase.User;
  userInfo: any;

  totalOffer: number;
  totalBooking: number;
  isOfferActive: boolean;
  subscription: Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private userService: UsersService,
    private offersService: OffersService,
    private bookingsService: BookingsService,
    private router: Router,
  ) {
    this.initializeApp();
    this.totalOffer = 0;
    this.isOfferActive = false;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {

    const authSub = this.authService.getUserState().pipe(
      switchMap(user => {
        if (user) {
          this.user = user;
          return this.userService.getUser(user.uid);
        } else {
          return of(null);
        }
      })
    ).subscribe((profile) => {
      this.userInfo = { ...profile, ...this.user };

      if (this.userInfo.roles.assistant) {
        this.isOfferActive = true;
      }
      /** count offers */
      if (this.user) {
        const offerCount = this.offersService.getSizeById(this.user.uid).subscribe((res) => {
          this.totalOffer = res.docs.length;
        });
        this.subscription.add(offerCount);
        /** count bookings */
        const bookingCount = this.bookingsService.getSizeById(this.user.uid).subscribe((res) => {
          this.totalBooking = res.docs.length;
        });
        this.subscription.add(bookingCount);
      }
    });
    this.subscription.add(authSub);
  }

  onLogout() {
    this.authService.logout();
    this.subscription.unsubscribe();
    this.router.navigateByUrl('/home');
  }

}
