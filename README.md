# skeleton-jwt-auth

A template appropriate for publishing a nodejs server with:

- authentication through passport using the JSON Web Token strategy.
- a postgres database for data storage (at this stage hosted locally)

Incorporates the following elements:

- Basic project set-up with Vite
- Testing environment for react
- Single page app router set-up
- JSON web token configuration to interact with a separate nodejs back-end
- Basic components to manage registration, login and viewing a protected dashboard.

A skeleton for a JSON web token strategy applied using passport.
Applies local strategy equivalent to generate salt and hash at registration
and check the password at login.
Then issues a JWT for the user, using private-public keys.
Currently set up to output JSON to a front-end application.

A step-by-step guide which would set-up much of the project is described below, but in using this template, none of the steps need to be carried out, other than:

1. npm install
2. create .env, the public and private keys, and add the db strings

## Install the express-generator

It is assumed that the express generator has been installed globally. If not, do so:

```bash
$ npm install -g express-generator
```

## Create the express project and git repository

Create the express project, initialise the git repository locally, then add the repository to github...

### Option 1 - create the express project first:

Create the project with the projectname, from the general repo directory
(Note, this supports the ejs web templates but its likely I won't use these)

```bash
 express projectname --view=ejs
```

In the directory, install the dependencies

```bash
 npm install
```

Add **gitignore** and remove node_modules and .env

```bash
node_modules
.env
```

Initialise the git repo, setting the name of the default branch.
Add and commit the new files.

```git
git init -b main
git add .
git commit -m "Initial commit"
```

Create the repository on github as usual, with no readme file or gitignore.
Then follow the instructions for
"…or push an existing repository from the command line"
which are more or less...

```bash
git remote add origin insertSSHhere
git branch -M main
git push -u origin main
```

A note: the default express files still use "var" syntax. Ideally these should be replaced with const or let as appropriate. This will presumably be tidied up with the next version.

## Install nodemon to enable live updates of the server

(If nodemon is installed globally, this is not necessary.)
Nodemon ensures that on any update to the server, it is refreshed.
Note though, a page refresh is still necessary to see any changes created by the server.

```bash
npm install --save-dev nodemon
```

## Add npm scripts for ease

Note the serverstart option enables console logging

```js
  "scripts": {
    "devstart": "nodemon ./bin/www",
    "serverstart": "DEBUG=projectname:* npm run devstart"
  },
```

## Bring the dependency versions up to date, and update them

**package.json**

```js
  "dependencies": {
    "cookie-parser": "^1.4.6",
    "debug": "^4.3.5",
    "express": "^4.19.2",
    "http-errors": "~2.0.0",
    "morgan": "^1.10.0",
    "ejs": "^3.1.10"
  },
```

```bash
npm install
```

## Install dotenv

Install dotenv for environment variable handling, in dev stage at least.

```bash
npm install dotenv
```

## Setting up .env

Create **.env** and add the following environment variables:

**NOTE: COME BACK TO THIS FOR POSTGRES EQUIVALENT**

```bash
PORT = 3000
NODE_ENV = "development"
DB_STRING_DEV = ""
DB_STRING_PROD = ""
RSA_PUBLIC_KEY = ""
RSA_PRIVATE_KEY = ""
```

## Install cors

Allows requests to be carried out from other domain names - e.g. separate react front end.

```bash
npm install cors
```

## Install Async Error Handler

express-async-handler is a simplifying library that gives a short hand for error catching, replacing a try catch structure which sends the error to the next middleware on error

express-ejs-layouts - update once know

```bash
npm install express-async-handler
```

## Add directory structure

1. **config** directory for database and passport configuration
2. **models** directory for data models
3. **controllers** directory for controllers
4. (**views** and **routes** directories already exist)
5. **utils** for general utility functions
6. **constants** for constants with scalability

## Authentication

Install **passport** and **passport-jwt** for the application of authenticaition using JWT
Install **crypto** to generate the salt and hash at registration, and to validate at login

```bash
npm install passport
npm install passport-local
npm install crypto
```

The following files and elements represent the authorisation and database setup:
**app.js** - review thoroughly to ensure comfortable with contents
**config/passport.js**
**routes/indexRoutes.js**
**controllers/userController.js**
**utils/authMiddleware.js**
**utils/generateKeyPair.js**
**utils/passwordUtils.js**
**utils/populatedb.js** - this will need to change a lot for postgres!

Then generate the public and private keys with the following command:

```bash
node utils/generateKeyPair
```

Then copy the keys generated in the lib subdirectory into .env, format:

```js
RSA_PUBLIC_KEY="-----BEGIN RSA PUBLIC KEY-----
MIICCgKCAgEApZ3krY0pIX+xGt0VryRqpdEWZaNJsgT5Ea8T/T4jGT85FasNJKRG
...
6V827vuqQ3uL38lxrYV6la1RQWwmxfYW4rjyVi9bn+mSNuuW4nAhNo0CAwEAAQ==
-----END RSA PUBLIC KEY-----"
```

**Don't forget to delete the generated .pem files!**

## Setting up the postgres database

Add the Prima CLI as a development dependency

```bash
npm install prisma --save-dev
```

Invoke the Prisma CLI:

```bash
npx prisma
```

### Setup the necessary prisma ORM files manually

The prisma element of the project is setup using the following command, which is safe to use, but because the project already has a .env and .igtignore, will only carry out part of the necessary stages:

```bash
npx prisma init
```

It will setup the prisma directory with the schema file inside **schema.prisma**

The data source in **schema.prisma** will be fine - referring to an environment variable, which should be added to **.env**, with the form below - user and password should be known. mydb in this template will be "skeleton_test"

```bash
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL =
  "postgresql://<USER>>:<PASSWORD>>@localhost:5432/<MYDB>?schema=public"
```

Prisma provides the following helpful instructions in the CLI:

```bash
Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Set the provider of the datasource block in schema.prisma to match your database: postgresql, mysql, sqlite, sqlserver, mongodb or cockroachdb.
3. Run prisma db pull to turn your database schema into a Prisma schema.
4. Run prisma generate to generate the Prisma Client. You can then start querying your database.
5. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and real-time database events. Read: https://pris.ly/cli/beyond-orm

More information in our documentation:
https://pris.ly/d/getting-started
```

## Set up a postgres database

Note, the below assumes that postgres is installed. If it isn't, follow the instructions [here](https://www.theodinproject.com/lessons/nodejs-installing-postgresql)

Also, [Odin project link](https://www.theodinproject.com/lessons/nodejs-using-postgresql) has an explanation of how to setup your database locally.

For the purposes of the template and just being able to check that everything is setup correctly, we will create or connect to a database called
**skeleton_test**

Run the Postgres shell in the terminal:

```bash
psql
```

View current databases (letter L not 1!):

```bash
\l
```

Create a database for this project:
(The semicolons are important in postgres shell!)

```bash
CREATE DATABASE skeleton_test;
```

Change to the new database:

```bash
\c dbname
```

Exit out of postgres shell:

```bash
\q
```

## Create a starting database schema

Update **schema.prisma** to

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id         Int      @id @default(autoincrement())
  username   String
  salt       String
  hash       String
  admin      Boolean  @default(false)
}
```

Then map the data model to the database schema in the client. This does the heavy lifting of updating the database model in postgres to match that of the schema. Check out the migration.sql file for an understanding.

(My interpretation is that **Prisma migrate dev** is used for code driven development, creating the schema, migrating it to a postgres schema, then incrementally amending the prisma schema.)

```bash
npx prisma migrate dev --name init
```

### Install Prisma Client

Note, installing prisma client invokes **prisma generate** which generates a version of the client that is tailored to the models.

```bash
npm install @prisma/client
```

**Now just need to hook up the postgres database to the nodejs application!**
