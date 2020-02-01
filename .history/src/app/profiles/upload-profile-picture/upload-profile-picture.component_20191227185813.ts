import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';

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
  selector: 'app-upload-profile-picture',
  templateUrl: './upload-profile-picture.component.html',
  styleUrls: ['./upload-profile-picture.component.scss'],
})
export class UploadProfilePictureComponent implements OnInit {
  form: FormGroup;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.form = new FormGroup({
      image: new FormControl(null)
    });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onUpload() {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Creating place...'
      })
      .then(loadingEl => {
        loadingEl.present();

        this.offersService
          .uploadImage(this.form.get('image').value)
          .pipe(
            switchMap(uploadRes => {
              const offer  = {
                title: this.form.value.title,
                description: this.form.value.description,
                imageUrl: uploadRes.imageUrl,
                price: +this.form.value.price,
                availableFrom: new Date(this.form.value.dateFrom),
                availableTo: new Date(this.form.value.dateTo),
                userId: this.user.uid, // change on actual id
                location: this.form.value.location
              };
              return this.offersService.insertOffer(offer);
            })
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/t/services/offers']);
          });
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
        console.log(error);
        return;
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ image: imageFile });
  }
}
