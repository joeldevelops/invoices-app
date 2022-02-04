# Invoice App

This service shows and allows users to manage their invoices.

- [Invoice App](#invoice-app)
  - [Docker Setup](#docker-setup)
  - [Running the App via Docker Compose](#running-the-app-via-docker-compose)
  - [Running the App Locally](#running-the-app-locally)
  - [Using the App](#using-the-app)
    - [Getting a User](#getting-a-user)
    - [Adding Invoices](#adding-invoices)
  - [Running in Heroku](#running-in-heroku)
  - [Testing](#testing)
- [App Design Decisions](#app-design-decisions)
  - [Monolith vs Microservices](#monolith-vs-microservices)
  - [Testing](#testing-1)
  - [App Startup](#app-startup)
  - [Error Handling](#error-handling)
  - [What's Missing?](#whats-missing)
    - [Testing](#testing-2)
    - [Front End Routing](#front-end-routing)
    - [Pages](#pages)
    - [Emailing](#emailing)
    - [Input Validation](#input-validation)
    - [Swagger/OpenAPI](#swaggeropenapi)

## Docker Setup

To start, create a `.env` file with the fields from the following sample at the root of the project:

.env
```
PORT=8080
RUNTIME_ENV=dev|test|prod
LOG_LEVEL=debug

MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=invoice-app
MONGO_CONN_STRING=

JWT_PRIVATE_KEY=Something-Private
```

## Running the App via Docker Compose

Run the following command to run the service in a docker container:
```
docker compose up --build # Optionally add -d if you wish to daemonize the app
```

## Running the App Locally

If you decide to run the application locally, you need to set up a mongodb connection. You can run the following commands:
```
docker compose up mongo -d
npm start
```

Optionally, you can specify your own Mongodb connection via the `MONGO` variables in the `.env` file. You can specify the host/port ect. or specify a connection string which takes precedence.

## Using the App
This app is very straight forward and backend-heavy. There are pieces missing from the frontend for the sake of time.

### Getting a User
The app will not automatically take you to login, so click on "sign up" or "login" in the nav bar to create a user/get a token.

There is no loading screen, so check the network tab or console to ensure that the request went through successfully. Once you have a token, it is added to local storage and can be used for the rest of the app.

### Adding Invoices
In the backend the roles are set up so that only admins can add invoices, this is going based off of the assumption that these invoices are to be paid by another user. For ease of use, every new user is an admin.

Click on the "new invoice" tab and you will be able to fill out a form for a new invoice. Once the invoice is created you can view it on the "invoices" tab. Also, if you set the due date to sometime in the past, the invoice will show up on the "past due" tab.

## Running in Heroku

The app will automatically build and run in heroku when a code change is pushed to main. Make sure these ENVs exist for the application by running `heroku config:set key=value --app invoices-app`
```
RUNTIME_ENV=test
MONGO_CONN_STRING=...
...
```

## Testing
For running unit tests on the server:
```
cd server
npm test
```

Test coverage can also be generated with:
```
npm run test:coverage
```

Tests are not yet available for the frontend.

# App Design Decisions

## Monolith vs Microservices
I decided to go with a monolith for this application as it is the easiest approach with the time constraints given. However, I believe that a microservices approach suits this specific type of application better. Given more time I would break out the following parts of the application into their own services:

- Invoices
- Users
- Scheduling Service
- Emailing Service

Additionally, the `auth` folder should actually be an internal node module that is published to a private repo that this project can access. This would enable scalability for each of the above broken-out services that rely on auth. The `/auth` endpoint should exists in the Users service.

You'll see that the `scheduler` calls the model of `invoices` directly. This is an anti-pattern and the true approach here is either to expose the functionality via a service for a monolith. Or in the case of microservices a RMQ stomp message should be emitted from Scheduling -> Invoices to kick off this process. Similarly RMQ could be used for Invoices -> emailing service to send off emails.

## Testing
Tests are unit-only and cover most of the core functionality for the user and invoice domains. The main thing that needed to be inspected was validation on calling the models, and that the code works correctly given normal input.

## App Startup
The startup process for this app is mostly standard for a 12-factor app. To make development and testing of this application easier, I opted to include database connection on startup even though this generally should be avoided. 

The scheduled process for marking invoices due or late is also run after app start up. This enables a tester to see the effect of the function without having to wait until midnight. It is also possible to expose this via an API call for the sake of testing but it probably a bad idea for a real application.

## Error Handling
I used custom errors where needed but opted out of using a custom error handling middleware as the injected express error handler is sufficient after the try/catch blocks in the code.

## What's Missing?
The details below are an admission of the things I would have like to have included, but did not find the time for.

### Testing
Testing is sparse on this project from the perspective of a production-ready application. I elected to omit integration/e2e tests in the interest of time. I also did not fully complete testing for the auth package. Luckily the code is straight forward and tests can easily be added in the future should they be needed.

Also there are no tests for the React portion of this application.

### Front End Routing
There is basic routing in the FE but there are some things I would have liked to include. Specifically I would've liked redirecting the user if they are or aren't logged in. Redirects after login, and after new invoice submission. Loading screens would have been nice too.

### Pages
The following pages have existing functionality on the backend, but no pages on the frontend as they are not specified as requirements in the assessment:

- View specific invoice details
- Pay invoice
- Filter/Search on Invoices
- Update User Info
- Update Invoice

### Emailing
It would be simple to including mailing via `nodemailer` or similar packages. This ideally should be handled by a separate service, but if it were to be included there is already placeholder comments in the code where it could be added. Under a new folder called `emails` there could be the HTML templates for the emails and the business logic for handling the pre-flight validation.

### Input Validation
Joi is a common package to handle the input/request validation, but there are no complex inputs in this project that would require it. (Hapi is also a very nice web framework! :D)

### Swagger/OpenAPI
I'll be honest, writing these yaml files is a nightmare, but they are nice to have in a live application.
