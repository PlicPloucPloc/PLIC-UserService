class User {
    id: string;
    firstname: string;
    lastname: string;
    birthdate: Date;

    constructor(id: string, firstname: string, lastname: string, birthdate: Date) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.birthdate = birthdate;
    }
}

export default User;
