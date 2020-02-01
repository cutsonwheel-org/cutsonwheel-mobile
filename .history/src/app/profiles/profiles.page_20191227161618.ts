import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProfilesService } from './profiles.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../services/location';
import { switchMap, map } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { Observable } from 'rxjs';
import { Users } from '../users/users';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.page.html',
  styleUrls: ['./profiles.page.scss'],
})
export class ProfilesPage implements OnInit {
  form: FormGroup;
  user: firebase.User;
  users: Users;

  constructor(
    private authService: AuthService,
    private profilesService: ProfilesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private userService: UsersService,
  ) { }

  ngOnInit() {

    this.authService.getUserState()
      .subscribe( user => {
        this.user = user;
        this.getDetail(user.uid);
    });

    this.form = new FormGroup({
      firstname: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      lastname: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      dateOfBirth: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(null, { validators: [Validators.required]}),
      avatar: new FormControl(null)
    });
  }

  getDetail(uid) {
    this.userService.getUser(uid).subscribe((detail) => {
      console.log(address);
      this.users = detail;
    });
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
  }

  onLocationPicked(selectedLocation: PlaceLocation) {
    this.form.patchValue({
      location: selectedLocation
    });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }
}
