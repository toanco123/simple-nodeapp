import express from "express";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import countryRoutes from "./routes/countryRoutes.js";
import 'dotenv/config'
import cookieParser from 'cookie-parser';
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/country", countryRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
