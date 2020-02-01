import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { switchMap } from 'rxjs/operators';

import { PlaceLocation, Coordinates } from './../../services/location';
import { LocationService } from './../../shared/services/location.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  private authSub: Subscription;
  user: firebase.User;
  private location: Location;
  // center = {};
  // googleMaps: any;
  // location: PlaceLocation;

  firstname: string;
  lastname: string;
  middlename: string;
  lat: number;
  lng: number;
  address: string;
  staticMapImageUrl: string;
  displayName: string;
  role: string;

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
          this.firstname = profile.firstname;
          this.lastname = profile.lastname;
          this.middlename = profile.middlename;
          this.displayName = this.user.displayName;
          // this.role = (profile.roles.assistant)
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
        // Select a Payment Method
          // credit/debit card - paypal [skip for now]

        // Freelancers with Plus Membership are 99.9% more likely to be awarded a booking.
        // - paypal [skip for now]
        // this.router.navigateByUrl('setup/option');
      });
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
