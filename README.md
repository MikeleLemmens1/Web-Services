[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/snPWRHYg)

# Examenopdracht Web Services

- Student: Lemmens Mikele
- Studentennummer: 202291269
- E-mailadres: <mailto:mikele.lemmens@student.hogent.be>

## Vereisten

Ik verwacht dat volgende software reeds geïnstalleerd is:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

Dit zijn de geïnstalleerde packages:

```terminal
yarn add koa
yarn add nodemon --dev
yarn add config
yarn add env-cmd --dev
yarn add @koa/router
yarn add koa-bodyparser
yarn add @koa/cors
yarn add knex
yarn add mysql2
yarn add --dev jest
yarn add --dev supertest
yarn add joi
yarn add node-emoji@1.11.0
yarn add koa-helmet
yarn add argon2
yarn add jsonwebtoken
```

## Opstarten

Maak een .env met volgende inhoud:

```.env
NODE_ENV=development
DATABASE_PASSWORD='SnKQ1eNSvgyaCkzOFFFU'
DATABASE_USER='291269ml'
```

## Testen

Maak een .env.test met volgende inhoud:

```.env
NODE_ENV=test
DATABASE_PASSWORD='SnKQ1eNSvgyaCkzOFFFU'
DATABASE_USER='291269ml'
```
