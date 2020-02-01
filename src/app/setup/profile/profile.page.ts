import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { switchMap } from 'rxjs/operators';

import { LocationService } from './../../shared/services/location.service';

// export class PhoneNumber {
//   country: string;
//   area: string;
//   prefix: string;
//   line: string;
//   // format phone numbers as E.164
//   get e164() {
//     const num = this.country + this.area + this.prefix + this.line;
//     return `+${num}`;
//   }
// }
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  private authSub: Subscription;
  user: firebase.User;
  email: string;
  firstname: string;
  lastname: string;
  middlename: string;
  // phoneNumber = new PhoneNumber();
  phoneNumber: string;
  lat: number;
  lng: number;
  address: string;
  staticMapImageUrl: string;
  displayName: string;
  role: string;
  isAgree: boolean;
  isEmailReadOnly: boolean;
  isPhoneReadOnly: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService,
    private locationService: LocationService
  ) {
    this.isEmailReadOnly = false;
    this.isPhoneReadOnly = false;
  }

  ngOnInit() {
    // get user current location
    this.locationService.currentLocation().then((geoPosition) => {
      this.lat = geoPosition.coords.latitude;
      this.lng =  geoPosition.coords.longitude;
      this.locationService.getAddress(this.lat, this.lng).subscribe((currentAddress) => {
        this.address = currentAddress;
      });
      this.staticMapImageUrl = this.locationService.getMapImage(this.lat, this.lng, 18);
    });

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
        // make sure its return object
        if (this.user) {
          this.firstname = (profile.name) ? profile.name.firstname : null;
          this.lastname = (profile.name) ? profile.name.lastname : null;
          this.middlename = (profile.name) ? profile.name.middlename : null;
          this.displayName = profile.displayName;
          this.email = profile.email;
          this.phoneNumber = this.user.phoneNumber;
          if (profile.roles) {
            this.role = (profile.roles.assistant) ? 'assistant' : 'client';
          }
        }
    });
  }

  onNext() {
    // make sure all required fields not empty
    if (!this.firstname || !this.lastname || !this.address) {
      return;
    }
    const data = {
      id: this.user.uid,
      name: {
        firstname: this.firstname,
        lastname: this.lastname,
        middlename: this.middlename,
      },
      email: this.email,
      displayName: this.displayName,
      phoneNumber: this.phoneNumber,
      isSetupCompleted: (this.role === 'client') ? true : false,
      location: {
        lat: this.lat,
        lng: this.lng,
        address: this.address,
        staticMapImageUrl: this.staticMapImageUrl
      },
      roles: {
        client: (this.role === 'client') ? true : false,
        assistant: (this.role === 'assistant') ? true : false
      }
    };
    // update users documents
    this.usersService.update(data).then(() => {
      // check if account type is assistant
      if (this.role  === 'assistant') {
        // redirect to skill completions
        this.router.navigateByUrl('/setup/skill');
      } else {
        // redirect to discover page
        this.router.navigateByUrl('/t/services/discover');
      }
    });
  }

  accountSelected(event: CustomEvent) {
    this.role = event.detail.value;
  }

  onAgree(event: CustomEvent) {
    this.isAgree = event.detail.value;
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
