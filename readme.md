# Invoice App

This service shows and allows users to manage their invoices.

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

## Running the App

Run the following command to run the service in a docker container:
```
docker compose up --build # Optionally add -d if you wish to daemonize the app
```

### DB Connections
Please note that the database does not connect on startup. You will need to send a curl GET to `localhost:8080/readiness` to initialize the connection. In a production app we would have this running inside a K8 or pod that would be able to call this endpoint on a timer to validate a working app.

## Running the App Locally

If you decide to run the application locally, you need to set up a mongodb connection. You can run the following commands:
```
docker compose up mongo -d
npm start
```

Optionally, you can specify your own Mongodb connection via the `MONGO` variables in the `.env` file. You can specify the host/port ect. or specify a connection string which takes precedence.

## Running in Heroku

The app will automatically build and run in heroku when a code change is pushed to main. Make sure these ENVs exist for the application by running `heroku config:set key=value --app invoices-app`
```
RUNTIME_ENV=test
MONGO_HOST="cluster0.tygvo.mongodb.net"
MONGO_DATABASE=invoices-app
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