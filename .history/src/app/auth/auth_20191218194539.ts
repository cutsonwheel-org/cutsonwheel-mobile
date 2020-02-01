export class Auth {
    constructor(
        public id: string,
        public email: string,
        private token$: string,
        private tokenExpirationDate: Date
    ) {}

    get token() {
        if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
           return null;
        }
        return this.token$;
    }

    get tokenDuration() {
        if (!this.token) {
            return 0;
        }
        return this.tokenExpirationDate.getTime() - new Date().getTime();
    }
}
