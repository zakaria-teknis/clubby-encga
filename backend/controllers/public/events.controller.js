import Club from "../../models/club.model.js";
import Event from "../../models/event.model.js";

export const getEvents = async (req, res) => {
  try {
    const clubs = await Club.find({
      description: { $ne: "" },
      logo_url: { $ne: "" },
      instagram: { $ne: "" },
    });

    const clubNames = clubs.map((club) => club.name);

    const events = await Event.find({
      cover_image_url: { $ne: "" },
      club: { $in: clubNames },
    }).sort({ date: 1, time: 1 });

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventPageInfo = async (req, res) => {
  const { clubName } = req.params;
  const { eventNameSlug } = req.params;

  const club = await Club.findOne({
    name: clubName,
    description: { $ne: "" },
    logo_url: { $ne: "" },
    instagram: { $ne: "" },
  });
  const event = await Event.findOne({
    name_slug: eventNameSlug,
    club: clubName,
  });

  if (!club || !event) {
    return res.status(404).json({ message: "Page not found" });
  }

  try {
    res.status(200).json({
      event,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
