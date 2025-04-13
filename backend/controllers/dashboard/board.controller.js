import User from "../../models/user.model.js";

export const getBoardMembers = async (req, res) => {
  const id = req.user;

  try {
    const user = await User.findById(id);
    const boardMembers = await User.find({
      club: user.club,
      status: "signed-up",
    }).select("-password -role -status -createdAt -updatedAt");

    const boardPositionOrder = [
      "president",
      "vice-president",
      "treasurer",
      "general-secretary",
      "communications-manager",
      "human-ressources-manager",
      "logistics-manager",
    ];
    boardMembers.sort((a, b) => {
      return (
        boardPositionOrder.indexOf(a.board_position) -
        boardPositionOrder.indexOf(b.board_position)
      );
    });

    res.status(200).json({ boardMembers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
