import Listing from "../model/Listing.model.js";
import User from "../model/User.model.js";
import { errorHandler } from "../utils/Error.js";
import bcryptjs from "bcryptjs";
export const test = (req, res) => {
  res.json({
    massage: "its connected",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "you can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    console.log("params id", req.params.id);
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User have been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const Listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(Listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    console.log("params id", req.params.id);
    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._id;
    console.log(user._id)
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
