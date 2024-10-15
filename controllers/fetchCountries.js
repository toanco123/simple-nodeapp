import axios from 'axios';
import Country from '../models/country.js';

const fetchCountries = async () => {
  const query = `
    {
      countries {
        code
        name
      }
    }
  `;

  try {
    const response = await axios.post('https://countries.trevorblades.com/', {
      query
    });

    const countries = response.data.data.countries;

    for (const country of countries) {
      await Country.create({
        name: country.name,
        code: country.code
      });
    }

    console.log('Countries have been saved successfully.');
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
};

fetchCountries();
