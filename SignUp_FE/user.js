export class User
{
    constructor(id, username, firstname, lastname, email, address, degree)
    {
        this.id = id;
        this.username = username;
        this.firstName = firstname;
        this.lastName = lastname;
        this.email = email;
        this.address = address;
        this.degree = degree;
    }

    getUserInfo()
    {
        return `${this.username}, ${this.firstName} ${this.lastName}`;
    }

}