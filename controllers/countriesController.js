import Country from "../models/country.js";

const getCountries = async (req, res, next) => {
  try {
    console.time("answer time");
    const countries = await Country.findAll();
    console.timeEnd("answer time");
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPaginationCountries = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    console.time("answer time");
    // const { count, rows } = await Country.findAndCountAll({
    //   limit: parseInt(limit),
    //   offset: parseInt(offset),
    // });

    const [totalItems, countries] = await Promise.all([
      Country.count(),
      Country.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
      }),
    ]);

    // const totalItems = Country.count()
    // const countries = Country.findAll({
    //     limit: parseInt(limit),
    //     offset: parseInt(offset),
    //   });

    const totalPages = Math.ceil(totalItems / limit);
    console.log("111111111111", totalItems);
    const data = JSON.stringify(countries)
    console.log("data",data);

    res.json({
      data: countries,
      pagination: {
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getCountries, getPaginationCountries };
