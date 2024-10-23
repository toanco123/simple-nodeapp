import axios from "axios";
import Country from "../models/country.js";
import Continents from "../models/continents.js";
import Languages from "../models/languages.js";
import States from "../models/states.js";
import Subdivision from "../models/subdivision.js";
import ContinentsCountriesStates from "../models/continents_countries_states.js";
import lodash from "lodash";
import { sequelize } from "../db.js";

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

    // Tạo các mảng để lưu trữ dữ liệu
    const countriesData = [];
    const languagesData = [];
    const subdivisionsData = [];
    const statesData = [];
    const continentsCountriesStatesData = [];

    const continentsData = new Set();

    // Lấy dữ liệu để lưu
    for (const country of countries) {
      continentsData.add(JSON.stringify({
        code: country.continent.code,
        name: country.continent.name,
      }));

      countriesData.push({
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
        continentCode: country.continent.code,
      });

      if (country.languages && country.languages.length) {
        for (const language of country.languages) {
          languagesData.push({
            code: language.code,
            name: language.name,
            native: language.native,
            rtl: language.rtl,
          });
        }
      }

      if (country.states && country.states.length) {
        for (const state of country.states) {
          statesData.push({
            name: state.name,
            code: state.code,
            countryCode: country.code,
          });
        }
      }

      if (country.subdivisions && country.subdivisions.length) {
        for (const subdivision of country.subdivisions) {
          subdivisionsData.push({
            code: subdivision.code,
            name: subdivision.name,
            emoji: subdivision.emoji,
            countryCode: country.code,
          });
        }
      }
    }

    // Xử lý dữ liệu trước khi lưu
    const continentsDataArray = Array.from(continentsData).map(JSON.parse);

    // Bulk create cho bảng Continents
    const continentsChunkData = lodash.chunk(continentsDataArray, 50);
    await Promise.all(continentsChunkData.map(data => 
      Continents.bulkCreate(data, { ignoreDuplicates: true })
    ));

    // Bulk create cho bảng Country
    const countriesChunkData = lodash.chunk(countriesData, 50);
    await Promise.all(countriesChunkData.map(data => 
      Country.bulkCreate(data, { ignoreDuplicates: true })
    ));

    // Bulk create cho bảng States
    const statesChunkData = lodash.chunk(statesData, 50);
    await Promise.all(statesChunkData.map(data => 
      States.bulkCreate(data, { ignoreDuplicates: true })
    ));

    // Bulk create cho bảng Languages
    const languagesChunkData = lodash.chunk(languagesData, 50);
    await Promise.all(languagesChunkData.map(data => 
      Languages.bulkCreate(data, { ignoreDuplicates: true })
    ));

    // Bulk create cho bảng Subdivision
    const subdivisionsChunkData = lodash.chunk(subdivisionsData, 50);
    await Promise.all(subdivisionsChunkData.map(data => 
      Subdivision.bulkCreate(data, { ignoreDuplicates: true })
    ));

    // Lấy tất cả ID của countries, continents, states, languages, và subdivisions
    const allCountries = await Country.findAll({ where: {} });
    const allContinents = await Continents.findAll({ where: {} });
    const allStates = await States.findAll({ where: {} });
    const allLanguages = await Languages.findAll({ where: {} });
    const allSubdivisions = await Subdivision.findAll({ where: {} });

    // Cập nhật bảng `Country` với `languages_id` và `subdivisions_id`
    // for (const country of countries) {
    //   const foundCountry = allCountries.find((c) => c.code === country.code);

    //   if (country.languages && country.languages.length) {
    //     for (const language of country.languages) {
    //       const foundLanguage = allLanguages.find((lang) => lang.code === language.code);
          
    //       // Cập nhật `languages_id` vào bảng `Country`
    //       if (foundCountry && foundLanguage) {
    //         await foundCountry.update({ languages_id: foundLanguage.id });
    //       }
    //     }
    //   }

    //   if (country.subdivisions && country.subdivisions.length) {
    //     for (const subdivision of country.subdivisions) {
    //       const foundSubdivision = allSubdivisions.find((sub) => sub.code === subdivision.code);
          
    //       // Cập nhật `subdivisions_id` vào bảng `Country`
    //       if (foundCountry && foundSubdivision) {
    //         await foundCountry.update({ subdivisions_id: foundSubdivision.id });
    //       }
    //     }
    //   }
    // }

    const languageUpdates = [];
    const subdivisionUpdates = [];
  
    for (const country of countries) {
      const foundCountry = allCountries.find((c) => c.code === country.code);
  
      if (foundCountry) {
        if (country.languages && country.languages.length) {
          for (const language of country.languages) {
            const foundLanguage = allLanguages.find((lang) => lang.code === language.code);
            if (foundLanguage) {
              languageUpdates.push({
                countryId: foundCountry.id,
                languageId: foundLanguage.id,
              });
            }
          }
        }
  
        if (country.subdivisions && country.subdivisions.length) {
          for (const subdivision of country.subdivisions) {
            const foundSubdivision = allSubdivisions.find((sub) => sub.code === subdivision.code);
            if (foundSubdivision) {
              subdivisionUpdates.push({
                countryId: foundCountry.id,
                subdivisionId: foundSubdivision.id,
              });
            }
          }
        }
      }
    }
  
    // Tạo câu lệnh SQL cập nhật languages_id cho nhiều countries cùng lúc
    if (languageUpdates.length > 0) {
      const languageCases = languageUpdates
        .map(({ countryId, languageId }) => `WHEN id = ${countryId} THEN ${languageId}`)
        .join(" ");
  
      const languageQuery = `
        UPDATE Countries
        SET languages_id = CASE ${languageCases} END
        WHERE id IN (${languageUpdates.map((u) => u.countryId).join(", ")});
      `;
  
      await sequelize.query(languageQuery);
    }
  
    // Tạo câu lệnh SQL cập nhật subdivisions_id cho nhiều countries cùng lúc
    if (subdivisionUpdates.length > 0) {
      const subdivisionCases = subdivisionUpdates
        .map(({ countryId, subdivisionId }) => `WHEN id = ${countryId} THEN ${subdivisionId}`)
        .join(" ");
  
      const subdivisionQuery = `
        UPDATE Countries
        SET subdivisions_id = CASE ${subdivisionCases} END
        WHERE id IN (${subdivisionUpdates.map((u) => u.countryId).join(", ")});
      `;
  
      await sequelize.query(subdivisionQuery);
    }

    // Tạo dữ liệu để lưu vào bảng liên kết `ContinentsCountriesStates`
    for (const country of countries) {
      const foundCountry = allCountries.find((c) => c.code === country.code);
      const foundContinent = allContinents.find(
        (cont) => cont.code === country.continent.code
      );

      if (country.states && country.states.length) {
        for (const state of country.states) {
          const foundState = allStates.find((st) => st.code === state.code);

          // Thêm dữ liệu vào bảng liên kết với các id_countries, id_continents, id_states
          if (foundCountry && foundContinent && foundState) {
            continentsCountriesStatesData.push({
              id_countries: foundCountry.id,
              id_continents: foundContinent.id,
              id_states: foundState.id,
            });
          }
        }
      }
    }

    // Bulk insert vào bảng ContinentsCountriesStates
    const continentsCountriesStatesChunkData = lodash.chunk(continentsCountriesStatesData, 50);
    await Promise.all(continentsCountriesStatesChunkData.map(data => 
      ContinentsCountriesStates.bulkCreate(data, { ignoreDuplicates: true })
    ));

    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error fetching countries:", error.message);
  }
};

fetchCountries();
// check time
// console.time("answer time");
// await fetchCountries();
// console.timeEnd("answer time");