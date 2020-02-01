import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory,
  CameraPhoto, CameraSource } from '@capacitor/core';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  addNewToGallery() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }

    // Take a photo
    Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100
    })
    .then(image => {
      return image.base64String;
    })
    .catch(error => {
      console.log(error);
      return false;
    });
  }
}
