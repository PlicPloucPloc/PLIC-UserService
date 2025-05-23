class User{
    id: string;
    firstName: string;
    lastName: string;
    birthdate: Date;

    constructor(id: string, firstName: string, lastName: string, birthdate: Date) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthdate = birthdate;
    }
}

export default User;
