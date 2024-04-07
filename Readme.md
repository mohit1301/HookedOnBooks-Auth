# Hooked on Books - Books Management Application

Hooked on Books is a comprehensive books management application based on the microservices architecture. It comprises of the AUTH, BOOKS, and AUTHORS services, each hosted separately and communicating with each other using HTTP calls. This distributed architecture enhances modularity and scalability, allowing for independent development and deployment of each service.

## Auth Service

The Auth service is a crucial component of the Hooked on Books application, responsible for handling authentication and authorization functionalities. It is an integral part of the main books management app and plays a vital role in ensuring user data security and integrity.

### Features

-   **Comprehensive REST API**: Encompasses a comprehensive range of endpoints, facilitating seamless login and logout flows.

-   **Silent Authentication Mechanism**: Implemented a robust Silent Authentication mechanism utilizing JWT refresh token tokens, fortifying the system with top-tier. If the access token expires and a user is still logged in, a new token is issued using the Refresh Token assigned to that particular user.

### Deployed App Link

[Hooked on Books - Auth Service](https://hookedonbooks-auth.onrender.com)

## Installation

To run the Auth service locally, follow these steps:

1.  Clone the Auth service repository:

    ```bash
    git clone https://github.com/mohit1301/HookedOnBooks-Auth.git
    ```

2.  Install dependencies:

    ```bash
    cd hookedonbooks-auth
    npm install
    ```

3.  Create a .env file in the root directory and add the following environment variables:

    ```bash
    MONGODB_AUTH_URL=<your_mongodb_auth_url>
    AUTH_PORT=<desired_port_number>
    JWT_SECRET_KEY=<your_jwt_secret_key>
    JWT_REFRESH_SECRET_KEY=<your_jwt_refresh_secret_key>
    AUTH_BASEURL=<your_auth_baseurl>
    BOOKS_BASEURL=<your_books_baseurl>
    AUTHOR_BASEURL=<your_author_baseurl>
    BOOKS_DOMAIN=<your_books_domain>
    AUTHOR_DOMAIN=<your_author_domain>
    ```

4.  Start the server:

    ```bash
    npm start
    ```

5.  For development with automatic server restart, you can use:

    ```bash
    npm run devStart
    ```

## Note

Keep the values of `JWT_SECRET_KEY` & `JWT_REFRESH_SECRET_KEY` environment variables same across all the services of the Hooked On Books app, namely **_AUTH, BOOKS, AUTHORS_**
