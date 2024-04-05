import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userroute from "./routes/User.route.js";
import authRouter from "./routes/Auth.route.js";
import cookieParser from "cookie-parser";
import ListingRouter from "./routes/Listing.route.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected with monogoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.listen(5000, () => {
  console.log("server is runinng on port 5000!");
});
app.use(express.json());
app.use(cookieParser());
// get userTest route
app.use("/api/user", userroute);
app.use("/api/auth", authRouter);
app.use("/api/Listing", ListingRouter);
// this is middle ware that is use for errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
