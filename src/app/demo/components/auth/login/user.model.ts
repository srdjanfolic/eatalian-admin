export enum UserRole {
    FACILITY = "FACILITY",
    ADMIN = "ADMIN"
}

export class User {

    constructor(
        public username: string,
        public name: string,
        private accessToken: string,
        private expirationTime: number,
        private role: UserRole
    ) {}

    get token() {
        if (+Math.floor(Date.now() / 1000) > this.expirationTime) {
            return null;
        }
        return this.accessToken;
    }

    get _role() {
        return this.role;
    }
}
