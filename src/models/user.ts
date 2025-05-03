class User{
    id: string;
    firstName: string;
    lastName: string;
    age: number;

    constructor(id: string, firstName: string, lastName: string, age: number) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }
}

export default User;
