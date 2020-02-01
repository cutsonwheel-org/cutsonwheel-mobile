import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-option',
  templateUrl: './option.page.html',
  styleUrls: ['./option.page.scss'],
})
export class OptionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onNext() {
  //   if (!this.firstname || !this.lastname || !this.address) {
  //     return;
  //   }
  //   const data = {
  //     id: this.user.uid,
  //     firstname: this.firstname,
  //     lastname: this.lastname,
  //     middlename: this.middlename,
  //     displayName: this.displayName,
  //     location: {
  //       lat: this.lat,
  //       lng: this.lng,
  //       address: this.address,
  //       staticMapImageUrl: this.staticMapImageUrl
  //     }
  //   };
  //   this.usersService.update(data).then(() => {
  //     this.user.updateProfile({
  //       displayName: this.displayName
  //     }).then(() => {
  //       this.router.navigateByUrl('setup/option');
  //     });
  //   });
  // }
}
