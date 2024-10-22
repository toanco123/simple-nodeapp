import axios from "axios";
import Country from "../models/country.js";
import Continents from "../models/continents.js";
import Languages from "../models/languages.js";
import States from "../models/states.js";
import Subdivision from "../models/subdivision.js";
import ContinentsCountriesStates from "../models/continents_countries_states.js";
import lodash from "lodash";

const fetchCountries = async () => {
  const query = `
{
  countries {
    awsRegion
    code
    name
    capital
    native
    phone
    phones
    currency
    continent {
      code
      name
    }
    languages {
      code
      name
      native
      rtl
    }
    states {
      name
      code
    }
    subdivisions {
      code
      name
      emoji
    }
    currencies
    emoji
    emojiU
  }
}
  `;

  try {
    const response = await axios.post("https://countries.trevorblades.com/", {
      query,
    });

    const countries = response.data.data.countries;
    // const countriesData = [];
    // const languagesData = [];
    // const statesData = [];
    // const subdivisionsData = [];

    // const continentsData = new Set();
    // for (const country of countries) {
    //   const continentData = {
    //     code: country.continent.code,
    //     name: country.continent.name,
    //   };
    //   const continentString = JSON.stringify(continentData);
    //   continentsData.add(continentString);

    //   countriesData.push({
    //     awsRegion: country.awsRegion,
    //     capital: country.capital,
    //     code: country.code,
    //     currencies: country.currencies
    //       ? JSON.stringify(country.currencies)
    //       : null,
    //     currency: country.currency,
    //     emoji: country.emoji,
    //     emojiU: country.emojiU,
    //     name: country.name,
    //     native: country.native,
    //     phone: country.phone,
    //     phones: country.phones ? JSON.stringify(country.phones) : null,
    //     continentCode: country.continent.code,
    //   });

    //   if (country.languages && country.languages.length) {
    //     for (const language of country.languages) {
    //       languagesData.push({
    //         code: language.code,
    //         name: language.name,
    //         native: language.native,
    //         rtl: language.rtl,
    //       });
    //     }
    //   }

    //   if (country.states && country.states.length) {
    //     for (const state of country.states) {
    //       statesData.push({
    //         name: state.name,
    //         code: state.code,
    //         countryCode: country.code,
    //       });
    //     }
    //   }
    //   if (country.subdivisions && country.subdivisions.length) {
    //     for (const subdivision of country.subdivisions) {
    //       subdivisionsData.push({
    //         code: subdivision.code,
    //         name: subdivision.name,
    //         emoji: subdivision.emoji,
    //         countryCode: country.code,
    //       });
    //     }
    //   }
    // }

    // const continentsDataArray = Array.from(continentsData).map((item) =>
    //   JSON.parse(item)
    // );
    // // const continentsChunkData = lodash.chunk(continentsDataArray, 2);
    // // Promise.all(continentsChunkData.map(data => Continents.bulkCreate(data, {ignoreDuplicates: true})))
    // await Continents.bulkCreate(continentsDataArray, {
    //   ignoreDuplicates: true,
    // });
    // await Country.bulkCreate(countriesData, {
    //   ignoreDuplicates: true,
    // });
    // await Subdivision.bulkCreate(subdivisionsData, {
    //   ignoreDuplicates: true,
    // });
    // await States.bulkCreate(statesData, {
    //   ignoreDuplicates: true,
    // });
    // await Languages.bulkCreate(languagesData, {
    //   ignoreDuplicates: true,
    // });

    await Promise.all(
      countries.map(async (country) => {
        const [continent, created] = await Continents.findOrCreate({
          where: { code: country.continent.code },
          defaults: { name: country.continent.name },
        });

        const createdCountry = await Country.create({
          awsRegion: country.awsRegion,
          capital: country.capital,
          code: country.code,
          currencies: country.currencies ? JSON.stringify(country.currencies) : null,
          currency: country.currency,
          emoji: country.emoji,
          emojiU: country.emojiU,
          name: country.name,
          native: country.native,
          phone: country.phone,
          phones: country.phones ? JSON.stringify(country.phones) : null,
          continentId: continent.id,
        });

        if (country.languages && country.languages.length) {
          for (const language of country.languages) {
             const [createdLanguage] = await Languages.findOrCreate({
               where: {
                name: language.name,
                code: language.code
              },
               defaults: {
                 native: language.native,
                 rtl: language.rtl,
               },
             });
            await createdCountry.update({ languages_id: createdLanguage.id });
          }
        }

        let stateId = null;
        if (country.states && country.states.length) {
          for (const state of country.states) {
            const [createdState] = await States.findOrCreate({
              where: { code: state.code },
              defaults: { name: state.name },
            });
            stateId = createdState.id;
          }
        }

        // Find or create subdivisions and update subdivisions_id
        if (country.subdivisions && country.subdivisions.length) {
          for (const subdivision of country.subdivisions) {
            const [createdSubdivision] = await Subdivision.findOrCreate({
              where: { code: subdivision.code },
              defaults: {
                name: subdivision.name,
                emoji: subdivision.emoji,
              },
            });
            // Update subdivisions_id in Country
            await createdCountry.update({ subdivisions_id: createdSubdivision.id });
          }
        }

        await ContinentsCountriesStates.create({
          id_countries: createdCountry.id,
          id_continents: continent.id,
          id_states: stateId,
        });

      })
    );

    console.log("Countries and continents have been saved successfully.");
  } catch (error) {
    console.error("Error fetching countries:", error.message);
  }
};

fetchCountries();

// check time
// console.time("answer time");
// await fetchCountries();
// console.timeEnd("answer time");