# Voorbereiding examenvragen

1. Toon en bespreek 2 à 3 testen

- Jest en supertest gebruikt als test library en server voor de integratietesten
- env.test bevat de login voor de testserver
- jest.config bevat het pad naar de testscripts

test gezin.spec.js

- describe definieert een testsuite (groep van testen)
- beforeAll beschrijft wat er moet gebeuren voor alle testen starten
  - Server beschrijven om te gebruiken
  - Inloggen om headers te verkrijgen
  - Connectie met de databank maken om data te manipuleren
- Test suites per route, elk met before en afterall om modellen te manipuleren
- withServer gebruikt een setter om in de supertest setup zowel de server als de databankconnectie op te zetten voor de testsuite

2. Wat zijn de conventies om een API RESTful te noemen? Welke heb je toegepast in jouw projecten waarom? Waarom heb je de andere niet toegepast?

REST: REpresentational State Tranfer
Gebruikt HTTP-methodes om resources te verzenden en op te halen
URI verwijst naar verzameling van objecten (/api/gezinsleden)
Voorstelling van de objecten

Client/server architectuur
Stateless (info meegeven in de request)
Cacheable (veel gevraagde info opslaan in server)
Gelaagd (meerdere servers die op requests antwoorden voor schaalbaarheid)

Laatste 2 niet gebruikt vanwege kleine schaal van de API

3. Wat zijn NodeJS en Koa? Leg kort de werking van middlewares uit a.d.h.v. een voorbeeld uit jouw code. Wat is er speciaal aan middlewares in Koa? Wat is bv. het verschil tussen await next() en return next() in een middleware?

NodeJs: Server side JavaScript, runtime omgeving
NPM: Package Manager
Koa: Framework voor het bouwen van web API's
Yarn: Installeert alle dependencies
package.json: dependencies en commando's om app te starten

Koa installeert verschillende functies als een ketting in de app
next-functie roept volgende functie aan. await() zorgt ervoor volgende code niet meteen wordt uitgevoerd. return next() laat middleware overslaan.

installMiddleware

- CORS (verkrijg toegang tot resources in ander domein)
- Winston logger
- Bodyparser
- KoaHelmet
- Service Errors
- 400's

4. Leg, a.d.h.v. een voorbeeld uit jouw code, kort uit hoe routing werkt.

Koa Bodyparser parst requests
Router voert code uit als een request toekomt op de server
In de index van de rest-laag definieer je een router. Alle routes worden gedefinieerd. AllowedMethods retuorneert 405 indien niet toegelaten request. Eindpunt van de route is de functie in de rest-laag beschreven. Parameters kunnen aan de route worden meegegeven met :. De routes worden in de app geïnstalleerd in createServer.

5. Welke mogelijkheden zijn er op het gebied van datalaag in NodeJS? Wanneer kies je voor elke mogelijkheid? Welke heb jij gekozen en waarom? Hoe heb je dit dan geïmplementeerd?

Je kan zelf queries schrijven
Je kan een ORM gebruiken (sequelize)
Je kan een querybuilder gebruiken (knex)

Sequelize:

- Onderhoudt en vult de databank
- Geeft de mogelijkheid om relaties te definiëren
- Geeft timestamps mee
- De modellen zijn ES6 klassen -> methodes toevoegen
- Gebruik functies i.p.v. SQL-queries

Models gedefinieerd
Migrations en seeds uitgewerkt
Sequelize instantie gemaakt in data/index die wordt gebruikt door de servicelaag

6. Hoe zorg je ervoor dat enkel ingelogde gebruikers/gebruikers met een bepaalde rol een resource kunnen raadplegen?Leg uit a.d.h.v. een voorbeeld uit jouw code

rest/gezinnen: de router krijgt middleware mee (requireAuthentication). Deze checkt of de gebruiker de juiste credentials heeft en voegt de nodige info aan de sessie toe.
Je kan een gezin op ID opvragen indien je lid bent van dat gezin. Wanneer je een request stuurt wordt je gezin_id opgezocht en aan de sessie toegevoegd (checkAndParseSession in gezinsledenService). Als de ID's niet overeenstemmen krijg je een foutmelding.

7. Wat is async/await? Wat is de relatie met Promises?Leg uit a.d.h.v. jouw code

async/await zijn keywords die zorgen dat je asynchrone code kan schrijven die eruit ziet als synchrone code. Je krijgt een Promise terug. Een promise heeft verschillende callbackfuncties die voor verschillende statussen worden uitgevoerd. (pending, fulfilled, rejected) Dit is een oplossing die ervoor zorgt dat JavaScript in verschillende threads kan worden uitgevoerd waardoor je app niet vastloopt als je een request uitvoert.

8. Toon en bespreek jouw package.json. Wat staat hier allemaal in? Wat is het verschil tussen dependencies en devDependencies?

Aangemaakt door yarn init. Bevat alle dependencies en commando's om de app te starten. DevDependencies zijn de packages enkel nodig in development (zoals jest, supertest en nodemon). Scripts zijn uit te voeren commando's. Geen prefix: exact deze versie, tilde: ongeveer, hoedje: compatibel met.

9. Wat is een linter? Wat is het nut ervan?

Statische analyse van code om syntaxfouten en bad practices te vermijden. Kan ook uniformiteit afdwingen.

10. Hoe werkt jouw datalaag? Hoe krijg je data in de databank in development mode? Hoe wordt het databankschema up to date gehouden?Leg uit a.d.h.v. voorbeelden uit jouw code.

11. Wat is jouw extra functionaliteit? Hoe werkt het?

Deze wordt onderhouden door Sequelize. Sequelize-CLI zorgt voor de migraties: het opmaken van het databankschema. in createServer wordt initializeData opgeroepen uit data/index. De modellen worden gemaakt en de associaties worden gelegd.
De commando's `yarn sequelize-cli db:migrate` en `yarn sequelize-cli db:seed:all` worden gebruikt om de tabellen te creëren en ze vervolgens op te vullen. Dit dient te gebeuren voordat de server wordt opgestart. Sequelize vereist een extra config-bestand de naar 'development' wijst als default omgeving.

12. Welke lagen heb je typisch in een gelaagde applicatie? Welke lagen heb jij geimplementeerd? Wat is het nut/doel van elke laag? Hoe projecteer je de lagen presentatie/domein/persistentie hierop?.

Rest - Service - Data - Repository

Rest ontvangt queries en installeert middlewares
De servicelaag bevat de domeinlogica en gebruikt de parameters die worden doorgegeven door de restlaag
De datalaag verzorgt de communicatie met de databank (opzetten/afbreken, migraties en seeds)
De repositorylaag zorgt voor de SQL-queries om gegevens uit de databank te verkrijgen. Deze laag wordt in mijn project niet gebruikt omdat ik een ORM gebruik.

13. Hoe pak je logging aan?

We gebruiken Winston als middleware om boodschappen door te geven aan de ontwikkelaar. Winston helpt om een uniforme structuur op te zetten. Je kan levels definiëren en afhankelijk van de omgeving meer of minder info tonen. In de servicelaag definiëer je het level, in de configs definiëer je welke levels je zoal wil tonen per omgeving.

Rest - Service - Data - Repository

Rest ontvangt queries en installeert middlewares
De servicelaag bevat de domeinlogica en gebruikt de parameters die worden doorgegeven door de restlaag
De datalaag verzorgt de communicatie met de databank (opzetten/afbreken, migraties en seeds)
De repositorylaag zorgt voor de SQL-queries om gegevens uit de databank te verkrijgen. Deze laag wordt in mijn project niet gebruikt omdat ik een ORM gebruik. (abstractie van de datalaag)

