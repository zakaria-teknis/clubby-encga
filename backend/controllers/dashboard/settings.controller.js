import User from "../../models/user.model.js";

export const verifyPassword = async (req, res) => {
  const id = req.user;
  const { password } = req.body;

  try {
    const passwordIsVerified = await User.verifyPassword(id, password);

    res.status(200).json({ message: "Password verified" });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else res.status(500).json({ error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const id = req.user;
  const { password } = req.body;

  try {
    await User.updatePassword(id, password);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else res.status(500).json({ error: error.message });
  }
};
