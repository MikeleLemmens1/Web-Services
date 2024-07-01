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

## Opstarten

Maak een .env met volgende inhoud:

```.env
NODE_ENV=development
DATABASE_PASSWORD en DATABASE_USER: vul je logingegevens in voor de databank
```

Start de applicatie in development met `yarn start`
Start de applicatie in productie met `yarn start:prod`

## Testen

Maak een .env.test met volgende inhoud:

```.env
NODE_ENV=test
DATABASE_PASSWORD en DATABASE_USER: vul je logingegevens in voor de databank
```

Start de test met `yarn test`
Voor coverage: gebruik `yarn test:coverage`

## Migrations en seeds

Er wordt gebruik gemaakt van Sequelize CLI om de databank op te stellen en te vullen. Hiervoor dienen volgende commando's te worden uitgevoerd:

`yarn sequelize-cli db:migrate`
`yarn sequelize-cli db:seed:all`

## Gekende bugs

