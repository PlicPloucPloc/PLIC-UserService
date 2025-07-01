# User Service

This service is responsible for managing user accounts, including registration, login, and profile management.
To deploy this service locally you need to use the [PLIC-LocalDevelopment](https://github.com/PlicPloucPloc/PLIC-Local_Development) branch.

Every endpoints requires the Authorization header with a valid JWT token. Except for the registration, login and the getters for all users and a user by id that are not supposed to be exposed by the gateway.

> To acces the swagger documentation, you can use the following link: [http://localhost:3001/swagger](http://localhost:3001/swagger)
