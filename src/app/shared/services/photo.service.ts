import { Injectable } from '@angular/core';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory,
  CameraPhoto, CameraSource } from '@capacitor/core';

const { Camera, Filesystem, Storage } = Plugins;

export interface Photo {
  filepath: string;
  webviewPath: string;
  base64?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: Photo[] = [];
  constructor() { }

  addNewToGallery() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    // Take a photo
    // const capturedPhoto = await Camera.getPhoto({
    //   resultType: CameraResultType.Uri, // CameraResultType.Base64,
    //   source: CameraSource.Camera,
    //   quality: 100
    // });

    Camera.getPhoto({
      resultType: CameraResultType.Uri, // CameraResultType.Base64,
      saveToGallery: true,
      source: CameraSource.Camera,
      quality: 100,
      allowEditing: false,
      correctOrientation: true
    }).then((image) => {
      return image.webPath;
    });

    // this.photos.unshift({
    //   filepath: 'soon...',
    //   webviewPath: capturedPhoto.webPath
    // });
  }
}
