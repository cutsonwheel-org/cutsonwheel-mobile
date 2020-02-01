import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Wallets } from '../wallet/wallets';
import { PaymentsService } from '../payments/payments.service';
import { Payments } from '../payments/payments';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  slideOpts: any;

  user: firebase.User;
  token: firebase.auth.IdTokenResult;
  private authSub: Subscription;

  wallets: Wallets;
  payments: Payments;
  // wallets: any;

  total: number;
  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.slideOpts = {
      initialSlide: 0,
      speed: 400
    };

    this.authSub = this.authService.getUserState()
      .subscribe( user => {
        if (user) {
          this.user = user;
        }
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
