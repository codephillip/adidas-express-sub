# adidas_express_sub app

[![Build Status](https://app.travis-ci.com/codephillip/adidas-express-sub.svg?branch=main)](https://app.travis-ci.com/codephillip/adidas-express-sub)

[![codecov](https://codecov.io/gh/codephillip/adidas-express-sub/branch/main/graph/badge.svg?token=7PAP1MUBC5)](https://codecov.io/gh/codephillip/adidas-express-sub)

### Run the app in terminal
1. Start a Postgres database server on your machine or in the cloud.
2. Set the following environment variables in your .env file
3. Use the same enviroment variables for typeorm in your .prod.env file
```
POSTGRES_HOST=<address-where-database-running>
POSTGRES_PORT=<port-where-database-running>
POSTGRES_DB=<database-name>
POSTGRES_USER=<username-for-database>
POSTGRES_PASSWORD=<password-to-database>
```

3. Install packages and start the application server.

```
$ npm install
$ npm start
```

5. Build the application

```
$ npm build
```

6. Generate and apply migrations

```
$ npm typeorm migration:generate --config .dev.env -n database-migrations
$ npm build
$ npm typeorm migration:run --config .dev.env
```


### Run the app inside a Docker container

Build the docker container and get it up and running.

```
$ docker-compose build
$ docker-compose up
```

### Run migrations inside a Docker container

With docker-compose running, in another terminal:

```
$ docker exec -it docker_name /bin/sh
$ npm typeorm migration:generate -n migration_name --config .prod.env
$ npm build
$ npm typeorm migration:run --config .prod.env
```

### Make API calls against the server

1. Go to [http://localhost:8000/swagger](http://localhost:8000/swagger) to see Swagger documentation for API endpoints.
2. Run the APIs by clicking the "Try it now" button on the Swagger page.

### Run admin bro dashboard

Go to [http://localhost:8000/admin](http://localhost:8000/admin)

### Run tests and check code coverage

```
$ npm test
$ npm coverage
```

### Lint your code

```
$ npm lint
$ npm format
```
