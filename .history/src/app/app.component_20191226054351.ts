import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

import { Plugins, Capacitor, AppState } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
  ) {
    this.initializeApp();
  }

  private authSub: Subscription;
  private previousAuthState = false;

  public email: string;
  user: firebase.User;

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    this.authService.getUserState()
      .subscribe( user => {
        if (!user) {
          this.router.navigateByUrl('/auth');
        }
        this.user = user;
      });

    // this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
    //   if (!isAuth && this.previousAuthState !== isAuth) {
    //     this.router.navigateByUrl('/auth');
    //   }
    //   this.previousAuthState = isAuth;
    // });

    // Plugins.App.addListener('appStateChange', this.checkAuthOnResume.bind(this));

  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  // private checkAuthOnResume(state: AppState) {
  //   if (state.isActive) {
  //     this.authService
  //       .autoLogin()
  //       .pipe(take(1))
  //       .subscribe(success => {
  //         if (!success) {
  //           this.onLogout();
  //         }
  //       });
  //   }
  // }
}
