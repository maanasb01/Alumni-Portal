const { Pool, Client } = require("pg");
const countries = require("./seedData/countries.json");
const states = require("./seedData/states.json");
const citiesRawData = require("./seedData/cities.json");
require("dotenv").config();

// import {Prisma} from '@prisma/client';
// import countries from './seedData/countries.json';
// import states from './seedData/states.json';
// import citiesRawData from './seedData/cities.json';
// import { Client } from 'pg';

//node --max-old-space-size=4096 -- node_modules/ts-node/dist/bin -P tsconfig.json prisma/seed2.ts

// Database connection string
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString: connectionString,
});

interface City {
  id: number;
  name: string;
  state_id: number;
  state_code: string;
  state_name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  latitude: string;
  longitude: string;
  wikiDataId: string;
}

const cities: City[] = citiesRawData as City[];

//   const countryData: Prisma.CountryUncheckedCreateInput[] = [];
//   const currencyData: Prisma.CurrencyUncheckedCreateInput[] = [];
const countryData: any = [];
const currencySet=new Set();

for (let country of countries) {
  countryData.push({
    id: country.id,
    name: country.name,
  });

  // Check if currency is not already in the Set before adding
  const currencyEntry = {
    name: country.currency_name,
    currency: country.currency,
    currencySymbol: country.currency_symbol,
    countryId: country.id,
  };

    // Assuming you want to use a combination of name and symbol as a unique identifier for currency
    const currencyIdentifier = `${country.currency_name}-${country.currency_symbol}`;
    if (!currencySet.has(currencyIdentifier)) {
      currencySet.add(currencyEntry);
    }
  

  // currencyData.push({
  //   name: country.currency_name,
  //   currency: country.currency,
  //   currencySymbol: country.currency_symbol,
  //   countryId: country.id,
  // });
}
const currencyData:any = Array.from(currencySet);

const statesData = states.map((state: any) => ({
  id: state.id,
  name: state.name,
  countryId: state.country_id,
}));

const citiesData = cities.map((city) => ({
  id: city.id,
  name: city.name,
  countryId: city.country_id,
  stateId: city.state_id,
}));

console.log("Total Countries: ", countryData.length);
console.log("Total States: ", statesData.length);
console.log("Total Cities: ", citiesData.length);

async function main() {
  await client.connect();

  try {
    // Seeding countries table
    console.log("Seeding Country Database...");
    for (let country of countryData) {
      await client.query(
        `
        INSERT INTO "Country" (id, name)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `,
        [country.id, country.name]
      );
    }
    console.log("Seeded the Country Database Successfully.");

    // Seeding currency table
    console.log("Seeding Currency Database...");
    for (let currency of currencyData) {
      await client.query(
        `
        INSERT INTO "Currency" (name, currency, "currencySymbol", "countryId")
        VALUES ($1, $2,$3,$4)
        ON CONFLICT DO NOTHING;
      `,
        [
          currency.name,
          currency.currency,
          currency.currencySymbol,
          currency.countryId,
        ]
      );
    }
    console.log("Seeded the Currency Database Successfully.");

    // Seeding states table
    console.log("Seeding State Database...");
    for (let state of statesData) {
      await client.query(
        `
        INSERT INTO "State" (id, name, "countryId")
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING;
      `,
        [state.id, state.name, state.countryId]
      );
    }
    console.log("Seeded the State Database Successfully.");

    // Seeding cities table
    console.log("Seeding City Database...");
    for (let city of citiesData) {
      await client.query(
        `
        INSERT INTO "City" (id, name, "countryId", "stateId")
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING;
      `,
        [city.id, city.name, city.countryId, city.stateId]
      );
    }
    console.log("Seeded the City Database Successfully.");
  } catch (err) {
    console.error("Error executing SQL queries:", err);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Error in main function:", err);
  process.exit(1);
});
