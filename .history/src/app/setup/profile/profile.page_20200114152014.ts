import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { switchMap } from 'rxjs/operators';

import { LocationService } from './../../shared/services/location.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

    this.locationService.currentLocation().then((geoPosition) => {
      this.lat = geoPosition.coords.latitude;
      this.lng =  geoPosition.coords.longitude;
      this.locationService.getAddress(this.lat, this.lng).subscribe((currentAddress) => {
        this.address = currentAddress;
      });
      this.staticMapImageUrl = this.locationService.getMapImage(this.lat, this.lng, 18);
    });

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
        if (this.user) {
          if (this.user.phoneNumber) {

          }
          const phone = this.user.phoneNumber ? this.user.phoneNumber : profile.phoneNumber;
          const part1 = phone.substring(0, 3); // +63
          const part2 = phone.substring(3, 6); // 917
          const part3 = phone.substring(6, 9);
          const part4 = phone.substring(9);
          console.log(part1.replace('+', ''));
          console.log(part2);
          console.log(part3);
          console.log(part4);
          this.firstname = profile.firstname;
          this.lastname = profile.lastname;
          this.middlename = profile.middlename;
          this.displayName = this.user.displayName;
          this.phoneNumber.country = phone.substring(0, 3).replace('+', '');
          // this.phoneNumber.area
          // this.phoneNumber.prefix
          // this.phoneNumber.line
          // this.phoneNumber = this.phoneNumber.e164;
          this.role = (profile.roles.assistant) ? 'assistant' : 'client';
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
        // skill select
        // experience
        // language

        this.router.navigateByUrl('setup/skill');
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
