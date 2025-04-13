import User from "../models/user.model.js";
import Club from "../models/club.model.js";
import jwt from "jsonwebtoken";
import { createToken } from "../utlities/token.utility.js";

//request signup user
export const requestSignupUser = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      club,
      board_position,
      isEditor,
      phone,
      email,
    } = req.body;

    await User.requestSignup(
      first_name,
      last_name,
      club,
      board_position,
      isEditor,
      phone,
      email
    );

    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else res.status(500).json({ error: error.message });
  }
};

// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id, process.env.USER_SECRET, "7d");
    const club = await Club.findOne({ name: user.club });

    res.status(200).json({ token, user, club });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else res.status(500).json({ error: error.message });
  }
};

// signup user
export const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);

    const token = createToken(user._id, process.env.USER_SECRET, "7d");

    let club = await Club.findOne({ name: user.club });

    if (!club) {
      club = await Club.create({ name: user.club });
    }

    res.status(200).json({ token, user, club });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else res.status(500).json({ error: error.message });
  }
};

//get user
export const getUser = async (req, res) => {
  const id = req.user._id;
  try {
    const user = await User.findOne({ _id: id }).select("-password");
    const club = await Club.findOne({ name: user.club });
    res.status(200).json({ user, club });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//get approved user
export const getApprovedUser = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { userId } = jwt.verify(token, process.env.SIGNUP_SECRET);

    const user = await User.findById(userId).select("email -_id");

    if (!user) {
      return res.status(404).json({ error: "No email found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    if (error.message === "jwt expired") {
      const decoded = jwt.decode(token);
      if (decoded && decoded.userId) {
        await User.findByIdAndDelete(decoded.userId);
      }
    }

    return res.status(401).json({ error: error.message });
  }
};

//delete approved user
export const deleteApprovedUser = async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization.split(" ")[1];

  try {
    const { userId } = jwt.decode(token, process.env.SIGNUP_SECRET);
    await User.findByIdAndDelete(userId);

    res.status(200);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
