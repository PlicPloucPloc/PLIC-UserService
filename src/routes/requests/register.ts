class RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age: number;


    constructor(firstName: string, lastName: string, email: string, password: string, age: number) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.age = age;
    }
}

export default RegisterRequest;
