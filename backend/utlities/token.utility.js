import jwt from "jsonwebtoken";

export const createToken = (userId, secret, expiresIn) => {
  return jwt.sign({ userId }, secret, { expiresIn });
};
