import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { switchMap } from 'rxjs/operators';

import { LocationService } from './../../shared/services/location.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Users } from 'src/app/users/users';

export class PhoneNumber {
  country: string;
  area: string;
  prefix: string;
  line: string;
  // format phone numbers as E.164
  get e164() {
    const num = this.country + this.area + this.prefix + this.line;
    return `+${num}`;
  }
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  private authSub: Subscription;
  user: firebase.User;

  firstname: string;
  lastname: string;
  middlename: string;
  phoneNumber = new PhoneNumber();
  lat: number;
  lng: number;
  address: string;
  staticMapImageUrl: string;
  displayName: string;
  role: string;
  isAgree: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService,
    private locationService: LocationService
  ) {}

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
          this.firstname = profile.firstname;
          this.lastname = profile.lastname;
          this.middlename = profile.middlename;
          this.displayName = this.user.displayName;
          // check phoneNumber existing
          const phone = this.user.phoneNumber ? this.user.phoneNumber : profile.phoneNumber;
          if (phone) {
            // slice them accordingly
            this.phoneNumber.country = phone.substring(0, 3).replace('+', '');
            this.phoneNumber.area = phone.substring(3, 6);
            this.phoneNumber.prefix = phone.substring(6, 9);
            this.phoneNumber.line = phone.substring(9);
          }
          // check if roles existing
          if (profile.roles) {
            this.role = (profile.roles.assistant) ? 'assistant' : 'client';
          }
        }
    });
  }

  onNext() {
    if (!this.firstname || !this.lastname || !this.address) {
      return;
    }
    const data = {
      id: this.user.uid,
      firstname: this.firstname,
      lastname: this.lastname,
      middlename: this.middlename,
      displayName: this.displayName,
      phoneNumber: this.phoneNumber.e164,
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
    this.usersService.update(data).then(() => {
      this.user.updateProfile({
        displayName: this.displayName
      }).then(() => {
        if (this.role  === 'assistant') {
          this.router.navigateByUrl('/setup/skill');
        } else {
          this.router.navigateByUrl('/t/services/discover');
        }
      });
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
