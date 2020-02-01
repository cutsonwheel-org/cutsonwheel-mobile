import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users/users.service';
import { switchMap } from 'rxjs/operators';

import { PlaceLocation, Coordinates } from './../../services/location';
import { Location } from './../../shared/class/location';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private authSub: Subscription;
  user: firebase.User;
  private location: Location;
  // center = {};
  // googleMaps: any;
  // location: PlaceLocation;

  firstname: string;
  lastname: string;
  middlename: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    const curentLocation = new Location().currentLocation();
    curentLocation.then((geoPosition) => {
      const coordinates: Coordinates = {
        lat: geoPosition.coords.latitude,
        lng: geoPosition.coords.longitude
      };
      new Location().getAddress(coordinates.lat, coordinates.lng).subscribe((address) => {
        console.log(address);
      });
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
        }
    });
  }

  onNext() {
    if (!this.firstname || !this.lastname ) {
      return;
    }

    const data = {
      id: this.user.uid,
      firstname: this.firstname,
      lastname: this.lastname,
      middlename: this.middlename
    };
    this.usersService.update(data).then((response) => {
      console.log(response);
    });
  }

}
