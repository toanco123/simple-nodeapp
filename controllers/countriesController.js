import { Op } from "sequelize";
import Continents from "../models/continents.js";
import ContinentsCountriesStates from "../models/continents_countries_states.js";
import Country from "../models/country.js";
import Languages from "../models/languages.js";
import States from "../models/states.js";
import Subdivision from "../models/subdivision.js";

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
        attributes: { exclude: ["subdivisions_id"] }, // getall field in table and remove field into [""]
        // include: [
        //   {
        //     model: Languages,
        //     as: "language",
        //     attributes: ["id", "code", "name", "native", "rtl"],
        //   },
        //   {
        //     model: Subdivision,
        //     as: "subdivision",
        //     attributes: ["id", "code", "name", "emoji"],
        //   },
        // ],
      }),
    ]);

    // Chuyển đổi chuỗi JSON thành mảng cho languages_id
    const countriesWithLanguages = countries.map((country) => ({
      ...country.toJSON(),
      languages_id: JSON.parse(country.languages_id || "[]"), // Chuyển đổi chuỗi JSON thành mảng
    }));

    // Lấy tất cả các ngôn ngữ dựa trên languages_id
    const languageIds = [
      ...new Set(
        countriesWithLanguages.flatMap((country) => country.languages_id)
      ),
    ]; // Lấy tất cả id mà không bị trùng
    const languages = await Languages.findAll({
      where: {
        id: languageIds,
      },
    });

    // Tạo một bản đồ cho ngôn ngữ để dễ dàng truy cập
    const languageMap = languages.reduce((acc, language) => {
      acc[language.id] = language; // Tạo key là id
      return acc;
    }, {});

    // Gán thông tin ngôn ngữ vào từng quốc gia và kiểm tra ID 1
    const result = countriesWithLanguages.map((country) => {
      const status = country.languages_id.includes(1); // Kiểm tra có ID 1 không
      return {
        ...country,
        languages: country.languages_id.map((id) => languageMap[id] || null), // Lấy ngôn ngữ dựa trên id, trả về null nếu không tìm thấy
        status, // Thêm field mới vào kết quả
      };
    });

    const finalResult = result.map(({ languages_id, ...rest }) => rest);

    // const totalItems = Country.count()
    // const countries = Country.findAll({
    //     limit: parseInt(limit),
    //     offset: parseInt(offset),
    //   });

    const totalPages = Math.ceil(totalItems / limit);

    // const countriesWithStatus = countries.map((country) => {
    //   const status = country.language?.id === 1 ? true : false;
    //   return {
    //     ...country.toJSON(),
    //     status: status,
    //   };
    // });

    res.json({
      data: finalResult,
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

const updateCountries = async (req, res) => {
  try {
    const id = req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({
        status: 400,
        message: "ID must be a number",
      });
    }
    const country = await Country.findByPk(id);
    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }
    await country.update(req.body);
    res.status(200).json({ message: "Update successfully", data: country });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMultipleCountries = async (req, res) => {
    try {
      const { ids, data } = req.body;
  
      if (!Array.isArray(ids) || ids.some(isNaN)) {
        return res.status(400).json({
          status: 400,
          message: "IDs must be an array of numbers",
        });
      }
  
      const [updatedCount] = await Country.update(data, {
        where: {
          id: ids,
        },
      });
  
      if (updatedCount === 0) {
        return res.status(404).json({ message: "No countries were updated" });
      }
  
      res.status(200).json({ message: "Update successfully", updatedCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const deleteCountries = async (req, res) => {
    try {
      const id = req.params.id;
      if (isNaN(id)) {
        return res.status(400).json({
          status: 400,
          message: "ID must be a number",
        });
      }
      const country = await Country.findByPk(id);
      if (!country) {
        return res.status(404).json({ error: "Country not found" });
      }
      await country.destroy();
      res.status(200).json({ message: "Deleted successfully", data: country });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const deleteMultipleCountries = async (req, res) => {
    try {
      const { ids } = req.body;
  
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Please provide an array of IDs to delete." });
      }
      const existingCountries = await Country.findAll({
        where: { id: ids },
        attributes: ["id"],
      });

      const existingIds = existingCountries.map(country => country.id);
    
      const nonExistentIds = ids.filter(id => !existingIds.includes(id));

      if (nonExistentIds.length > 0) {
        return res.status(404).json({
          message: "Some IDs do not exist in the database.",
          nonExistentIds,
        });
      }
      
      const deletedCount = await Country.destroy({
        where: {
          id: ids,
        },
      });
  
      res.status(200).json({ message: "Deleted successfully", deletedCount });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

const getPaginationContinentsCountriesStates = async (req, res, next) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const [totalItems, countries] = await Promise.all([
      ContinentsCountriesStates.count({
        include: [
          {
            model: Continents,
            as: "continent",
            where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
          },
        ],
      }),
      ContinentsCountriesStates.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        attributes: ["id_countries"],
        include: [
          {
            model: Continents,
            as: "continent",
            attributes: ["code", "name"],
            where: {
              name: {
                [Op.like]: `%${search}%`,
              },
            },
          },
          //   {
          //     model: States,
          //     as: "state",
          //     attributes: ["id", "code", "name"],
          //   },
          {
            model: Country,
            as: "country",
            attributes: [
              "id",
              "awsRegion",
              "capital",
              "code",
              "currencies",
              "currency",
              "emoji",
              "emojiU",
              "name",
              "native",
              "phone",
              "phones",
              //   "languages_id",
              //   "subdivisions_id",
              "createdAt",
              "updatedAt",
            ],
          },
        ],
      }),
    ]);

    const continentIds = countries.map((continent) => continent.id);

    if (continentIds.length === 0) {
      return res.json({
        data: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
          itemsPerPage: 0,
        },
      });
    }

    const totalPages = Math.ceil(totalItems / limit);
    const countriesWithStatus = countries.map((country) => {
      const status = country.continent?.code === "NA" ? true : false;
      return {
        ...country.toJSON(),
        status: status,
      };
    });

    res.json({
      data: countriesWithStatus,
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

const getPaginationContinentsCountriesStates1 = async (req, res, next) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    // const continentCondition = {
    //     model: ContinentsCountriesStates,
    //     as: "continents_countries_states",
    //     attributes: [],
    //     include: [
    //       {
    //         model: Continents,
    //         as: "continent",
    //         where: { name: { [Op.like]: `%${search}%` } },
    //         attributes: [],
    //       },
    //     ],
    //   };
    const [totalItems, countries] = await Promise.all([
      Country.count({
        include: [
          {
            model: ContinentsCountriesStates,
            as: "continents_countries_states",
            attributes: [],
            required: true,
            include: [
              {
                model: Continents,
                as: "continent",
                where: {
                  name: {
                    [Op.like]: `%${search}%`,
                  },
                },
                attributes: [],
              },
            ],
          },
        ],
      }),
      Country.findAll({
        attributes: [
          "awsRegion",
          "capital",
          "code",
          "currencies",
          "currency",
          "emoji",
          "name",
          "native",
          "phone",
          "phones",
          "subdivisions_id",
          "languages_id",
          "createdAt",
          "updatedAt",
        ],

        include: [
          {
            model: ContinentsCountriesStates,
            as: "continents_countries_states",
            attributes: ["id"],
            required: true,
            include: [
              {
                model: Continents,
                as: "continent",
                // where: {
                //     name: {
                //       [Op.like]: `%${search}%`,
                //     },
                //   },
                attributes: ["code", "name"],
              },
            ],
          },
        ],

        limit: parseInt(limit),
        offset: parseInt(offset),
      }),
    ]);

    const continentIds = countries.map((continent) => continent.id);

    if (continentIds.length === 0) {
      return res.json({
        data: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
          itemsPerPage: 0,
        },
      });
    }
    const totalPages = Math.ceil(totalItems / limit);

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

export {
  getCountries,
  getPaginationCountries,
  getPaginationContinentsCountriesStates,
  getPaginationContinentsCountriesStates1,
  updateCountries,
  updateMultipleCountries,
  deleteCountries,
  deleteMultipleCountries,
};
