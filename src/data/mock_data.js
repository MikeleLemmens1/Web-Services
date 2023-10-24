let GEZINSLEDEN = [
  {
    id: 1,
    voornaam: "Mikele",
    email: "mikele.lemmens@hotmail.com",
    wachtwoord: "######",
    gezinsId: 1,
    verjaardagsId: 1
  },
  {
    id: 2,
    voornaam: "Charlotte",
    email: "desmetcharlotte2@gmail.com",
    wachtwoord: "######",
    gezinsId: 1,
    verjaardagsId: 2
  },
  {
    id: 3,
    voornaam: "Ellis",
    email: "",
    wachtwoord: "######",
    gezinsId: 1,
    verjaardagsId: 3,
  }
];
let GEZIN = [
  {
    gezinsId: 1,
    familienaam: "Lemmens",
    straat: "Binnenslag",
    huisnummer: 63,
    postcode: 9920,
    stad: "Lovendegem"
  }
];
let BOODSCHAPPEN = [
  {
    id: 1,
    naam: "Choco",
    winkel: "Colruyt",
    hoeveelheid: "1 pot",
    gezinsId: 1,
  },
  {
    id: 2,
    naam: "Hondenbrokken",
    winkel: "",
    hoeveelheid: "",
    gezinsId: 1
  },
  {
    id: 3,
    naam: "Kaas",
    winkel: "Colruyt",
    hoeveelheid: "",
    gezinsId:1
  },
  {
    id: 4,
    naam: "Pampers",
    winkel: "Kruidvat",
    hoeveelheid: "",
    gezinsId: 1
  }
];
let GEPLANDE_TAKEN = [
  {
    id: 1,
    naam: "Ellis halen",
    dag: '2023-10-16T00:00:00.000Z',
    gezinslidId: 1,
  },
  {
    id: 2,
    naam: "Ellis halen",
    dag: '2023-10-17T00:00:00.000Z',
    gezinslidId: 1,
  },
  {
    id: 3,
    naam: "Ellis halen",
    dag: '2023-10-18T00:00:00.000Z',
    gezinslidId: 2,
  },
  {
    id: 4,
    naam: "Ellis halen",
    dag: '2023-10-19T00:00:00.000Z',
    gezinslidId: 2,
  },
  {
    id: 5,
    naam: "Ellis halen",
    dag: '2023-10-20T00:00:00.000Z',
    gezinslidId: 1,
  },
  {
    id: 6,
    naam: "Ellis brengen",
    dag: '2023-10-16T00:00:00.000Z',
    gezinslidId: 2,
  },
  {
    id: 7,
    naam: "Ellis brengen",
    dag: '2023-10-17T00:00:00.000Z',
    gezinslidId: 2,
  },
  {
    id: 8,
    naam: "Ellis brengen",
    dag: '2023-10-18T00:00:00.000Z',
    gezinslidId: 1,
  },
  {
    id: 9,
    naam: "Ellis brengen",
    dag: '2023-10-19T00:00:00.000Z',
    gezinslidId: 1,
  },
  {
    id: 10,
    naam: "Ellis brengen",
    dag: '2023-10-20T00:00:00.000Z',
    gezinslidId: 2,
  },
  {
    id: 11,
    naam: "Koken",
    dag: '2023-10-16T00:00:00.000Z',
    gezinslidId: 2,
  },
  {
    id: 12,
    naam: "Koken",
    dag: '2023-10-17T00:00:00.000Z',
    gezinslidId: 1,
  },
  {
    id: 13,
    naam: "Koken",
    dag: '2023-10-18T00:00:00.000Z',
    gezinslidId: 2,
  },
  {
    id: 14,
    naam: "Koken",
    dag: '2023-10-19T00:00:00.000Z',
    gezinslidId: 1,
  },
  {
    id: 15,
    naam: "Koken",
    dag: '2023-10-20T00:00:00.000Z',
    gezinslidId: 2,
  },
  {
    id: 16,
    naam: "Hond uitlaten",
    dag: '2023-10-16T00:00:00.000Z',
    gezinslidId: 2,
  },
  {
    id: 17,
    naam: "Hond uitlaten",
    dag: '2023-10-17T00:00:00.000Z',
    gezinslidId: 2,
  },
  {
    id: 18,
    naam: "Hond uitlaten",
    dag: '2023-10-18T00:00:00.000Z',
    gezinslidId: 1,
  },
  {
    id: 19,
    naam: "Hond uitlaten",
    dag: '2023-10-19T00:00:00.000Z',
    gezinslidId: 1,
  },
  {
    id: 20,
    naam: "Hond uitlaten",
    dag: '2023-10-20T00:00:00.000Z',
    gezinslidId: 2,
  }
  
];
let VERJAARDAGEN = [
  {
    id: 1,
    dagnummer: 30,
    maandnummer: 12,
    voornaam: "Mikele",
    achternaam: "Lemmens",
    gezinsId: 1,
    gezinslidId: 1
  },
  {
    id: 2,
    dagnummer: 24,
    maandnummer: 8,
    voornaam: "Charlotte",
    achternaam: "De Smet",
    gezinsId: 1,
    gezinslidId: 2
  },
  {
    id: 3,
    dagnummer: 23,
    maandnummer: 9,
    voornaam: "Ellis",
    achternaam: "Lemmens",
    gezinsId: 1,
    gezinslidId: 3,
    
  },
  {
    id: 4,
    dagnummer: 30,
    maandnummer: 12,
    voornaam: "Mattia",
    achternaam: "Lemmens",

  }
];

let PLACES = [
  {
    id: 1,
    name: 'Dranken Geers',
    rating: 3,
  },
  {
    id: 2,
    name: 'Irish Pub',
    rating: 2,
  },
  {
    id: 3,
    name: 'Loon',
    rating: 4,
  },
];

let TRANSACTIONS = [
  {
    id: 1,
    amount: -2000,
    date: '2021-05-08T00:00:00.000Z',
    user: {
      id: 1,
      name: 'Thomas Aelbrecht',
    },
    place: {
      id: 2,
      name: 'Irish Pub',
    },
  },
  {
    id: 2,
    amount: -74,
    date: '2021-05-21T12:30:00.000Z',
    user: {
      id: 1,
      name: 'Thomas Aelbrecht',
    },
    place: {
      id: 2,
      name: 'Irish Pub',
    },
  },
  {
    id: 3,
    amount: 3500,
    date: '2021-05-25T17:40:00.000Z',
    user: {
      id: 1,
      name: 'Thomas Aelbrecht',
    },
    place: {
      id: 3,
      name: 'Loon',
    },
  },
];

module.exports = { TRANSACTIONS, PLACES, GEPLANDE_TAKEN, GEZIN, GEZINSLEDEN, BOODSCHAPPEN, VERJAARDAGEN };