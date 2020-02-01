import { PlaceLocation } from '../services/location';

export interface Notification {
  val: string;
  label: string;
  isChecked: boolean;
}

export interface Roles {
  client?: boolean;
  assistant?: boolean;
}

export interface Metadata {
  lastSignInTime: Date;
  creationTime: Date;
}

export interface Skill {
  name: string;
  level?: string;
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
    public skills?: Skill,
    public location?: PlaceLocation,
    public notification?: Notification,
    public roles?: Roles,
    public firstname?: string,
    public lastname?: string,
    public middlename?: string,
  ) {}
}
