export class Auth {
    constructor(
        public id: string,
        public email: string,
        public refreshToken: string,
        public emailVerified: boolean,
        public displayName: string,
        public photoURL: string,
        public phoneNumber: string,
        public creationTime: Date,
        public lastSignInTime: Date
        // private tokenExpirationDate: Date
    ) {}

    get token() {
        return this.refreshToken;
    }

    get uid() {
      return this.id;
  }
}
