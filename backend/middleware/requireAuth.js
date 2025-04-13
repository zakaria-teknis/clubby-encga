import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { userId } = jwt.verify(token, process.env.USER_SECRET);

    req.user = await User.findById(userId).select("_id");
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
