### Refactoring a Clean Architecture en NestJS

## Requirements

- Node.js >= 20.0.0
- Yarn


### Installation

`yarn install`

### Running

This example requires docker or a local MySQL installation. If using a local MySQL database, see `app.module.ts` for credentials, and make sure there are matching credentials in the database and the source code.

#### Docker

**Important**: It's necessary that Docker is installed.

There is a `docker-compose.yml` file for starting Docker.

`docker compose up`

After running the sample, you can stop the Docker container with

`docker compose down`

To delete non used containers:

`docker container prune`

To delete non used volumes:

`docker volume prune`

To delete non used resouces (included images. network):

`docker system prune`

#### Databases

production: used by the api in runtime

localhost:3306 usr:root pwd:root

staging: used by the api in e2e test

localhost:3307 usr:root pwd:root

### Run the sample

Then, run Nest as usual:

`yarn start`
