import Customer from "../models/customer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

const generateAccessToken = (customer) => {
  return jwt.sign({ username: customer.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (customer) => {
  return jwt.sign({ username: customer.username }, JWT_REFRESH_SECRET, {
    expiresIn: "7d", // Refresh token có thời gian sống lâu hơn, ví dụ 7 ngày
  });
};

const registerCustomer = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password do not match." });
    }

    const existingCustomer = await Customer.findOne({ where: { username } });
    if (existingCustomer) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = await Customer.create({
      username,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "Customer created", customer: newCustomer });
  } catch (error) {
    console.error("Error registering customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { username, password } = req.body;

    const customer = await Customer.findOne({ where: { username } });
    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);

    customer.refreshToken = refreshToken;
    await customer.save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error logging in customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const customer = await Customer.findOne({
      where: { username: decoded.username, refreshToken },
    });

    if (!customer) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Tạo access token mới
    const newAccessToken = generateAccessToken(customer);

    res.status(200).json({
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ message: "Refresh token expired, please login again" });
    }

    console.error("Error refreshing access token:", error);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

const logoutCustomer = async (req, res) => {
  const { username } = req.body;

  try {
    const customer = await Customer.findOne({ where: { username } });
    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    customer.refreshToken = null;
    await customer.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { registerCustomer, loginCustomer, refreshAccessToken, logoutCustomer };
