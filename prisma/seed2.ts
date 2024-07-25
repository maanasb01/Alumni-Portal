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
const currencySet = new Set();

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
const currencyData: any = Array.from(currencySet);

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
    // console.log("Seeding Country Database...");
    // for (let country of countryData) {
    //   await client.query(
    //     `
    //     INSERT INTO "Country" (id, name)
    //     VALUES ($1, $2)
    //     ON CONFLICT DO NOTHING;
    //   `,
    //     [country.id, country.name]
    //   );
    // }
    // console.log("Seeded the Country Database Successfully.");

    console.log("Seeding Country Database...");
    // for (let country of countryData) {
    //   await client.query(
    //     `
    //     INSERT INTO "Country" (id, name)
    //     VALUES ($1, $2)
    //     ON CONFLICT DO NOTHING;
    //   `,
    //     [country.id, country.name]
    //   );
    // }

    const query = `
    INSERT INTO "Country" (id, name)
    VALUES ${countryData
      .map((c: any, index: number) => `($${index * 2 + 1}, $${index * 2 + 2})`)
      .join(", ")}
    ON CONFLICT DO NOTHING;   
  `;

    const values = countryData.flatMap((country: any) => [
      country.id,
      country.name,
    ]);

    const res = await client.query(query, values);

    console.log("Seeded the Country Database Successfully.");

    // Seeding currency table
    // console.log("Seeding Currency Database...");
    // for (let currency of currencyData) {
    //   await client.query(
    //     `
    //     INSERT INTO "Currency" (name, currency, "currencySymbol", "countryId")
    //     VALUES ($1, $2,$3,$4)
    //     ON CONFLICT DO NOTHING;
    //   `,
    //     [
    //       currency.name,
    //       currency.currency,
    //       currency.currencySymbol,
    //       currency.countryId,
    //     ]
    //   );
    // }
    // console.log("Seeded the Currency Database Successfully.");

    console.log("Seeding Currency Database...");

    const queryCurrency = `
    INSERT INTO "Currency" (name, currency, "currencySymbol", "countryId")
    VALUES ${currencyData
      .map(
        (c: number, index: number) =>
          `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${
            index * 4 + 4
          })`
      )
      .join(", ")}
    ON CONFLICT  DO NOTHING; 
  `;

    // Flatten the array of values
    const valuesCurrency = currencyData.flatMap((currency: any) => [
      currency.name,
      currency.currency,
      currency.currencySymbol,
      currency.countryId,
    ]);
    await client.query(queryCurrency, valuesCurrency);

    console.log("Seeded the Currency Database Successfully.");




    // Seeding states table

    // console.log("Seeding State Database...");
    // for (let state of statesData) {
    //   await client.query(
    //     `
    //     INSERT INTO "State" (id, name, "countryId")
    //     VALUES ($1, $2, $3)
    //     ON CONFLICT DO NOTHING;
    //   `,
    //     [state.id, state.name, state.countryId]
    //   );
    // }
    // console.log("Seeded the State Database Successfully.");

    console.log("Seeding State Database...");
    const queryState = `
    INSERT INTO "State" (id, name, "countryId")
    VALUES ${statesData.map((s:any, index:number) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ')}
    ON CONFLICT DO NOTHING;   
  `;

  // Flatten the array of values
  const valuesStates = statesData.flatMap((state:any) => [state.id, state.name, state.countryId]);

  await client.query(queryState, valuesStates);
    console.log("Seeded the State Database Successfully.");

    // Seeding cities table
    console.log("Seeding City Database...");
    // for (let city of citiesData) {
    //   await client.query(
    //     `
    //     INSERT INTO "City" (id, name, "countryId", "stateId")
    //     VALUES ($1, $2, $3, $4)
    //     ON CONFLICT DO NOTHING;
    //   `,
    //     [city.id, city.name, city.countryId, city.stateId]
    //   );
    // }

  //   const queryCity = `
  //   INSERT INTO "City" (id, name, "countryId", "stateId")
  //   VALUES ${citiesData.map((c, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ')}
  //   ON CONFLICT DO NOTHING;   
  // `;

  // // Flatten the array of values
  // const valuesCities = citiesData.flatMap(city => [city.id, city.name, city.countryId, city.stateId]);
const batchSize=1000;
  const totalBatches = Math.ceil(citiesData.length / batchSize);
  for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
    const start = batchIndex * batchSize;
    const end = start + batchSize;
    const batch = citiesData.slice(start, end);

    // Prepare the query
    const queryCity = `
      INSERT INTO "City" (id, name, "countryId", "stateId")
      VALUES ${batch.map((_, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`).join(', ')}
      ON CONFLICT DO NOTHING;  
    `;

    // Flatten the array of values
    const valuesCities = batch.flatMap(city => [city.id, city.name, city.countryId, city.stateId]);

    try {
      // Execute the query
      const res = await client.query(queryCity, valuesCities);
      console.log(`Batch ${batchIndex + 1} inserted: ${res.rowCount} rows`);
    } catch (err) {
      console.error(`Error executing query for batch ${batchIndex + 1}`);
    }
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
