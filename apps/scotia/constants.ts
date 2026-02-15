
import { ScotiaAccountMap, Contact } from './types';

export const EDMONTON_EMPLOYERS = [
  "GOVERNMENT OF ALBERTA",
  "UNIVERSITY OF ALBERTA",
  "PCL CONSTRUCTION",
  "CITY OF EDMONTON",
  "STANTEC CONSULTING",
  "ALBERTA HEALTH SERVICES",
  "AB FARMS - NEURAL DIV"
];

export const EDMONTON_BILLERS = [
  "EPCOR - UTILITIES",
  "CITY OF EDMONTON - TAX",
  "TELUS COMMUNICATIONS",
  "ROGERS MOBILE",
  "ENMAX ENERGY",
  "AMERICAN EXPRESS"
];

export const EDMONTON_MERCHANTS = [
  "WEST EDMONTON MALL",
  "DUCHESS BAKE SHOP",
  "OODLE NOODLE",
  "CORSO 32",
  "ROGERS PLACE",
  "SAVE-ON-FOODS",
  "SAFEWAY",
  "PETRO-CANADA",
  "ETS - EDMONTON TRANSIT",
  "REMEDY CAFE",
  "HUDSON'S BAY",
  "ROOTS"
];

export const INITIAL_ACCOUNTS: ScotiaAccountMap = {
  'Basic Plus': {
    type: 'banking',
    balance: 12482.05,
    pending: 0,
    available: 12482.05,
    points: 0,
    history: []
  },
  'Momentum PLUS': {
    type: 'banking',
    balance: 24293.03,
    pending: 0,
    available: 24293.03,
    points: 0,
    history: [],
  },
  'Momentum Savings': {
    type: 'banking',
    balance: 5137.16,
    pending: 0,
    available: 5137.16,
    points: 0,
    history: [],
  },
  'Scotiabank Gold Amex Card': {
    type: 'credit',
    balance: 1455.00,
    pending: 0,
    available: 13545.00,
    points: 32450,
    history: [],
  },
  'Scotiabank Passport Visa Infinite card': {
    type: 'credit',
    balance: 2769.49,
    pending: 0,
    available: 12230.51,
    points: 12500,
    history: [],
  }
};

export const INITIAL_PAYEES = [
    { id: 'p1', name: 'EPCOR UTILITIES', accountNumber: '10002938475' },
    { id: 'p2', name: 'TELUS MOBILITY', accountNumber: '8392019283' },
    { id: 'p3', name: 'RBC VISA', accountNumber: '4519********2938' }
];

export const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'Jennifer Edwards', email: 'accounting@abfarms.ca', isFavorite: true, autodeposit: true },
  { id: '2', name: 'Alex Rivera', email: 'arivera@scotia.ca', isFavorite: false },
  { id: '3', name: 'Markus Vance', email: 'mvance@scotia.ca', isFavorite: false, autodeposit: true },
  { id: '4', name: 'Sophia Chen', email: 'schen@scotia.ca', isFavorite: true },
  { id: '5', name: 'David Lee', email: 'dlee@scotia.ca', isFavorite: false },
  { id: '6', name: 'Elena Petrova', email: 'epetrova@scotia.ca', isFavorite: false },
];
