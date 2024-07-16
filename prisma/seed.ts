// import { Prisma, PrismaClient } from "@prisma/client";
// import countries from "./seedData/countries.json";
// import states from "./seedData/states.json";
// import citiesRawData from "./seedData/cities.json";

// interface City {
//   id: number;
//   name: string;
//   state_id: number;
//   state_code: string;
//   state_name: string;
//   country_id: number;
//   country_code: string;
//   country_name: string;
//   latitude: string;
//   longitude: string;
//   wikiDataId: string;
// }

// const cities: City[] = citiesRawData as City[];

// const prisma = new PrismaClient();

// const countryData: Prisma.CountryUncheckedCreateInput[] = [];
// const currencyData: Prisma.CurrencyUncheckedCreateInput[] = [];

// console.log("1");

// for (let country of countries) {
//   countryData.push({
//     id: country.id,
//     name: country.name,
//   });
//   console.log("2");

//   currencyData.push({
//     name: country.currency_name,
//     currency: country.currency,
//     currencySymbol: country.currency_symbol,
//     countryId: country.id,
//   });
// }
// console.log("3");
// const statesData = states.map((state) => ({
//   id: state.id,
//   name: state.name,
//   countryId: state.country_id,
// }));
// console.log("4");

// const citiesData = cities.map((city) => ({
//   id: city.id,
//   name: city.name,
//   countryId: city.country_id,
//   stateId: city.state_id,
// }));

// async function main() {
//   console.log("Seeding Country Database...");

//   // await prisma.country.createMany({
//   //   data: countryData,
//   //   skipDuplicates: true,
//   // });
//   for (const country of countryData) {
//     await prisma.country.create({
//       data: country,
//     });
//   }

//   console.log("Seeded the Country Database Successfully.");

//   console.log("Seeding Currency Database...");

//   // await prisma.currency.createMany({
//   //   data: currencyData,
//   //   skipDuplicates: true,
//   // });
//   for (const currency of currencyData) {
//     await prisma.currency.create({
//       data: currency,
//     });
//   }

//   console.log("Seeded the Currency Database Successfully.");

//   console.log("Seeding State Database...");

//   // await prisma.state.createMany({
//   //   data: statesData,
//   //   skipDuplicates: true,
//   // });
//   for (const state of statesData) {
//     await prisma.state.create({
//       data: state,
//     });
//   }

//   console.log("Seeded the State Database Successfully.");

//   console.log("Seeding City Database...");

//   // await prisma.city.createMany({
//   //   data: citiesData,
//   //   skipDuplicates: true,
//   // });
//   for (const city of citiesData) {
//     await prisma.city.create({
//       data: city,
//     });
//   }

//   console.log("Seeded the City Database Successfully.");
// }
// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });


import {Prisma, PrismaClient } from '@prisma/client';
import countries from './seedData/countries.json';
import states from './seedData/states.json';
import citiesRawData from './seedData/cities.json';

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

const prisma = new PrismaClient();

const countryData: Prisma.CountryUncheckedCreateInput[] = [];
const currencyData: Prisma.CurrencyUncheckedCreateInput[] = [];

console.log("1");

for (let country of countries) {
  countryData.push({
    id: country.id,
    name: country.name,
  });
  console.log("2");

  currencyData.push({
    name: country.currency_name,
    currency: country.currency,
    currencySymbol: country.currency_symbol,
    countryId: country.id,
  });
}
console.log("3");
const statesData = states.map((state) => ({
  id: state.id,
  name: state.name,
  countryId: state.country_id,
}));
console.log("4");

const citiesData = cities.map((city) => ({
  id: city.id,
  name: city.name,
  countryId: city.country_id,
  stateId: city.state_id,
}));

async function main() {
  

  try {
    // Seeding countries table
    console.log('Seeding Country Database...');
    for (let country of countryData) {
      await prisma.$executeRaw`
        INSERT INTO Country (id, name)
        VALUES (${country.id}, ${country.name})
        ON CONFLICT DO NOTHING;
      `;
    }
    console.log('Seeded the Country Database Successfully.');

    // Seeding Currency Table
    console.log("Seeding Currency Table")
    for(let currency of currencyData) {
      await prisma.$executeRaw`
      INSERT INTO Currency (name,currency,currencySymbol,countryId)
      VALUES (${currency.name,currency.currency,currency.currencySymbol,currency.countryId})
      ON CONFLICT DO NOTHING;
      `
    }
    console.log('Seeded the Currency Database Successfully.');

    // Seeding states table
    console.log('Seeding State Database...');
    for (let state of statesData) {
      await prisma.$executeRaw`
        INSERT INTO State (id, name, countryId)
        VALUES (${state.id}, ${state.name}, ${state.countryId})
        ON CONFLICT DO NOTHING;
      `;
    }
    console.log('Seeded the State Database Successfully.');

    // Seeding cities table
    console.log('Seeding City Database...');
    for (let city of citiesData) {
      await prisma.$executeRaw`
        INSERT INTO City (id, name, countryId, stateId)
        VALUES (${city.id}, ${city.name}, ${city.countryId}, ${city.stateId})
        ON CONFLICT DO NOTHING;
      `;
    }
    console.log('Seeded the City Database Successfully.');

  } catch (err) {
    console.error('Error executing SQL queries:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

