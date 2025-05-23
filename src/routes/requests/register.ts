class RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthdate: Date;


    constructor(firstName: string, lastName: string, email: string, password: string, birthdate: Date) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
    }
}

export default RegisterRequest;
