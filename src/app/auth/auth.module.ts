import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';
import { FirebaseUIModule, firebase, firebaseui } from 'firebaseui-angular';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  siteName: 'Cuts on Wheel',
  signInOptions: [
    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      defaultCountry: 'PH'
    }
  ],
  tosUrl: 'https://cutsonwheel.com/terms-of-use',
  privacyPolicyUrl: 'https://cutsonwheel.com/privacy-policy'
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthPageRoutingModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
