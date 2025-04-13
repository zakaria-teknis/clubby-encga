import Club from "../../models/club.model.js";
import User from "../../models/user.model.js";
import Member from "../../models/member.model.js";
import Event from "../../models/event.model.js";

export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({
      description: { $ne: "" },
      logo_url: { $ne: "" },
      instagram: { $ne: "" },
    });
    res.status(200).json({ clubs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClubPageInfo = async (req, res) => {
  const { clubName } = req.params;
  try {
    const club = await Club.findOne({
      name: clubName,
      description: { $ne: "" },
      logo_url: { $ne: "" },
      instagram: { $ne: "" },
    });
    if (!club) {
      return res.status(404).json({ message: "Page not found" });
    }

    const boardMembers = await User.find({ club: clubName }).select(
      "-password -role -status -createdAt -updatedAt"
    );
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

    const membersCount = await Member.countDocuments({ club: clubName });
    const upcomingEventsCount = await Event.countDocuments({
      $expr: {
        $gt: [
          {
            $dateFromString: {
              dateString: { $concat: ["$date", "T", "$time", ":00"] },
            },
          },
          new Date(),
        ],
      },
      cover_image_url: { $ne: "" },
    });

    const upcomingEvents = await Event.find({
      $expr: {
        $gt: [
          {
            $dateFromString: {
              dateString: { $concat: ["$date", "T", "$time", ":00"] },
            },
          },
          new Date(),
        ],
      },
      cover_image_url: { $ne: "" },
    })
      .sort({ date: 1, time: 1 })
      .select(
        "_id name name_slug cover_image_url logo_url date time entry internal_ticket_price external_ticket_price"
      );

    res.status(200).json({
      club,
      boardMembers,
      membersCount,
      upcomingEventsCount,
      upcomingEvents,
    });
  } catch (error) {
    if (err.message === "clubNotFound") {
      return res.status(404).json({ message: "Club not found" });
    }

    res.status(500).json({ error: error.message });
  }
};
