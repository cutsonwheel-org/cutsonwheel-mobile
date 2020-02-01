import { PlaceLocation } from '../services/location';

export interface Notification {
  val: string;
  label: string;
  isChecked: boolean;
}

export interface Roles {
  client?: boolean;
  assistant?: boolean;
  admin?: boolean;
}

export interface Metadata {
  lastSignInTime: Date;
  creationTime: Date;
}

export class Users {
  constructor(
    public email: string,
    public emailVerified: boolean,
    public photoURL: string,
    public displayName: string,
    public phoneNumber: string,
    public isAnonymous: boolean,
    public tenantId: string,
    public id: string,
    public metadata: Metadata,
    public isSetupCompleted: boolean,
    public isValidated: boolean,

    public experience?: string,
    public visibility?: string,
    public classification?: string,
    public location?: PlaceLocation,
    public notification?: Notification,
    public roles?: Roles,
    public firstname?: string,
    public lastname?: string,
    public middlename?: string,
  ) {}
}
