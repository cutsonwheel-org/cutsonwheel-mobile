export class Auth {
    constructor(
      // public refreshToken: string,
        public id: string,
        public email: string,
        public emailVerified: boolean,
        public displayName: string,
        public photoURL: string,
        public phoneNumber: string,
        public creationTime: Date,
        public lastSignInTime: Date
    ) {}

  //   get token() {
  //       return this.refreshToken;
  //   }

  //   get uid() {
  //     return this.id;
  // }
}
