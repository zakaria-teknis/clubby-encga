import { createToken } from "../../utlities/token.utility.js";
import User from "../../models/user.model.js";
import {
  approvedUserEmail,
  rejectedUserEmail,
} from "../../utlities/email.utility.js";

export const getRequests = async (req, res) => {
  try {
    const requests = await User.find({
      status: { $in: ["pending", "approved"] },
    });
    res.status(200).json({ requests });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const approveRequest = async (req, res) => {
  const { id, firstName, lastName, club, boardPosition, email } = req.body;
  try {
    const signupToken = createToken(id, process.env.SIGNUP_SECRET, "3d");
    await approvedUserEmail(
      firstName,
      lastName,
      club,
      boardPosition,
      email,
      signupToken
    );
    await User.approveRequest(id);

    res.status(200).json({ message: "Request approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rejectRequest = async (req, res) => {
  const { firstName, lastName, club, boardPosition, email, id } = req.query;

  try {
    await rejectedUserEmail(firstName, lastName, club, boardPosition, email);
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};
