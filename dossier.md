# Mikele Lemmens (202291269)

- [ ] Web Services: GITHUB URL
  - <https://github.com/Web-IV/2324-webservices-MikeleLemmens1.git>
  - <LINK_ONLINE_VERSIE_HIER>

**Logingegevens**

- Gebruikersnaam/e-mailadres: <mikele.lemmens@student.hogent.be>
- Wachtwoord:

> Vul eventueel aan met extra accounts voor administrators of andere rollen.

## Projectbeschrijving

 Een gezin moet met bijzonder veel zaken rekening houden. Iedere dag lijkt er een waslijst aan taken en herinneringen te zijn die snel overweldigend kunnen worden. Het bijhouden van zulke zaken in een gebruiksvriendelijk overzicht kan al een deel van het werk overnemen. Ik maak de API die kan worden gebruikt om dit mogelijk te maken.  

Een gezin is de groep van gebruikers. Het bestaat uit **gezinsleden** (dit zullen de uiteindelijke gebruikers worden), en heeft een lijst met **geplande taken**, een **boodschappenlijst** en een **verjaardagskalender**. Hier nog extra info per entiteit:  

- Een gezin heeft een *familienaam*, adres (bestaande uit *straat*, *huisnummer*, *postcode* en *stad*), een of meerdere gezinsleden en een *id*.
- Ieder gezinslid heeft een *id*, *voornaam*, *email*, eventueel een *wachtwoord* (niet alle gezinsleden moeten gebruiker zijn) en een *verjaardagsId*.
- Een geplande taak is een taak die toebehoort aan een gezinslid en dient te worden uitgevoerd op een bepaalde dag. De gezinsplanner kan een overzicht geven van alle taken die op een bepaalde dag of week zijn ingepland. Er is een *taakId*, *naam*, *dag* en *gezinslidId* (de uitvoerder).
- Een boodschap wordt gekenmerkt door zijn *id*, en heeft verder een *naam* (of beschrijving), *winkel* en *hoeveelheid*. De winkel en hoeveelheid zijn optioneel.
- De verjaardagen worden verzameld in een verjaardagskalender en bevatten een *id*, *dagnummer*, *maandnummer*, *voornaam* en *familienaam*. Ook de verjaardagen van de gezinsleden worden hierin opgenomen, maar de meerderheid van de verjaardagen zullen van mensen zijn die niet tot het gezin behoren.

![ERD Gezinsplanner](./src/image-2.png)

## API calls

> Indien je als extra Swagger koos, dan voeg je hier een link toe naar jouw online documentatie. Swagger geeft nl. exact (en nog veel meer) wat je hieronder moet schrijven.

### Gezinsleden

- `GET /api/gezinsleden`: alle gezinsleden ophalen
- `GET /api/gezinsleden/:voornaam`: gezinslid ophalen op voornaam

### Gezin

- `GET /api/gezin`: alle info van het gezin ophalen

### Boodschap ###

- `GET /api/boodschappen`: alle boodschappen ophalen
- `GET /api/boodschappen/:winkel`: alle boodschappen voor een bepaalde winkel ophalen

### GeplandeTaak ###

- `GET /api/geplande_taken`: alle geplande taken ophalen, m.u.v. diegene die in het verleden liggen.
- `GET /api/geplande_taken/:dag`: alle geplande taken van een bepaalde dag ophalen
- `GET /api/geplande_taken/:week`: alle geplande taken van een bepaalde week ophalen
- `GET /api/geplande_taken/:gezinslidId`: alle geplande taken van een bepaald gezinslid ophalen

### Verjaardag ###

- `GET /api/verjaardagen`: alle geregistreerde verjaardagen ophalen
- `GET /api/verjaardagen/:maand`: alle verjaardagen voor een bepaalde maand ophalen
- `GET /api/verjaardagen/:voornaam`: de verjaardag van een persoon ophalen

## Behaalde minimumvereisten

> Duid per vak aan welke minimumvereisten je denkt behaald te hebben
>
### Web Services

- **datalaag**

  - [ ] voldoende complex (meer dan één tabel, 2 een-op-veel of veel-op-veel relaties)
  - [ ] één module beheert de connectie + connectie wordt gesloten bij sluiten server
  - [ ] heeft migraties - indien van toepassing
  - [ ] heeft seeds
<br />

- **repositorylaag**

  - [ ] definieert één repository per entiteit (niet voor tussentabellen) - indien van toepassing
  - [ ] mapt OO-rijke data naar relationele tabellen en vice versa - indien van toepassing
<br />

- **servicelaag met een zekere complexiteit**

  - [ ] bevat alle domeinlogica
  - [ ] bevat geen SQL-queries of databank-gerelateerde code
<br />

- **REST-laag**

  - [ ] meerdere routes met invoervalidatie
  - [ ] degelijke foutboodschappen
  - [ ] volgt de conventies van een RESTful API
  - [ ] bevat geen domeinlogica
  - [ ] geen API calls voor entiteiten die geen zin hebben zonder hun ouder (bvb tussentabellen)
  - [ ] degelijke authorisatie/authenticatie op alle routes
<br />

- **algemeen**

  - [ ] er is een minimum aan logging voorzien
  - [ ] een aantal niet-triviale integratietesten (min. 1 controller >=80% coverage)
  - [ ] minstens één extra technologie
  - [ ] maakt gebruik van de laatste ES-features (async/await, object destructuring, spread operator...)
  - [ ] duidelijke en volledige README.md
  - [ ] volledig en tijdig ingediend dossier en voldoende commits

## Projectstructuur

### Web Services

> Hoe heb je jouw applicatie gestructureerd (mappen, design patterns...)?

## Extra technologie

### Web Services

> Wat is de extra technologie? Hoe werkt het? Voeg een link naar het npm package toe!

## Testresultaten

### Web Services

> Schrijf hier een korte oplijsting en beschrijving van de geschreven testen + voeg een screenshot van de coverage en uitvoering toe

## Gekende bugs

### Web Services

> Zijn er gekende bugs?
