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
    // Take a photo
    Camera.getPhoto({
      resultType: CameraResultType.Uri, // CameraResultType.Base64
      source: CameraSource.Camera,
      quality: 100
    });
  }
}
