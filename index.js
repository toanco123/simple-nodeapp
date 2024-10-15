import express from "express";
import userRoutes from "./routes/userRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/api/user", userRoutes);
app.use("/v1/api/customer", customerRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
