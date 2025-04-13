import User from "../../models/user.model.js";
import Event from "../../models/event.model.js";
import { supabase } from "../../utlities/supabase.utility.js";
import fs from "fs";
import emptyTempDirectory from "../../utlities/emptyTempDirectory.utility.js";
import { v4 as uuidv4 } from "uuid";

const formatEventName = (event) => {
  return event.toLowerCase().replace(/\s+/g, "-");
};

export const getEvents = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id).select("club");

    const events = await Event.find({
      club: user.club,
    });
    res.status(200).json({ events });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addEvent = async (req, res) => {
  const userId = req.user;
  const files = req.files;

  let coverImage = null;
  let logo = null;
  let guestImages = [];

  if (files && files.coverImage) coverImage = files.coverImage[0];
  if (files && files.logo) logo = files.logo[0];
  if (files && files.guestImages) guestImages = files.guestImages;

  const {
    name,
    date,
    time,
    location,
    googleMapsLink,
    entry,
    internalTicketPrice,
    externalTicketPrice,
  } = req.body;

  let logoUrl = "";
  let coverImageUrl = "";

  let ticketStands = [];
  let programSteps = [];
  let guests = [];

  try {
    ticketStands = JSON.parse(req.body.ticketStands);
    programSteps = JSON.parse(req.body.programSteps);
    const { guests: guestsData } = JSON.parse(req.body.guests);
    guests = guestsData;

    ticketStands = ticketStands.map((stand) => {
      return {
        id: stand.id,
        date: stand.date,
        start_time: stand.startTime,
        end_time: stand.endTime,
        location: stand.location,
        google_maps_link: stand.googleMapsLink,
      };
    });

    guests = guests.map((guest) => {
      return {
        id: guest.id,
        full_name: guest.fullName,
        instagram: guest.instagram,
        linkedin: guest.linkedin,
        description: guest.description,
        guest_image_url: "",
      };
    });

    await Event.eventValidation(
      coverImage,
      logo,
      guestImages,
      name,
      date,
      time,
      location,
      googleMapsLink,
      entry,
      internalTicketPrice,
      externalTicketPrice,
      ticketStands,
      programSteps,
      guests
    );

    guests = guests.map((guest) => ({
      ...guest,
      guest_image_url:
        guestImages.find((file) => {
          const guestId = file.originalname.split("-").slice(1, 6).join("-");
          return guestId === guest.id;
        }) || "",
    }));

    if (logo) {
      const filePath = logo.path;
      const fileContent = await fs.promises.readFile(filePath);

      // Generate a new unique filename
      const uniqueFilename = `${uuidv4()}-${logo.originalname}`;

      // Upload image to Supabase
      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .upload(`dashboard/events/logos/${uniqueFilename}`, fileContent, {
          cacheControl: "3600",
          upsert: false,
          contentType: logo.mimetype,
        });

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }

      // Generate Public URL
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("images")
        .getPublicUrl(`dashboard/events/logos/${uniqueFilename}`);

      if (publicUrlError) {
        throw new Error(publicUrlError.message);
      }

      await fs.promises.unlink(filePath);

      logoUrl = publicUrlData.publicUrl;
    }

    if (coverImage) {
      const filePath = coverImage.path;
      const fileContent = await fs.promises.readFile(filePath);

      // Generate a new unique filename
      const uniqueFilename = `${uuidv4()}-${coverImage.originalname}`;

      // Upload image to Supabase
      const { error: imageDeleteError } = await supabase.storage
        .from("images")
        .upload(
          `dashboard/events/cover-images/${uniqueFilename}`,
          fileContent,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: coverImage.mimetype,
          }
        );

      if (imageDeleteError) {
        throw new Error(imageDeleteError.message);
      }

      // Generate Public URL
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("images")
        .getPublicUrl(`dashboard/events/cover-images/${uniqueFilename}`);

      if (publicUrlError) {
        throw new Error(publicUrlError.message);
      }

      coverImageUrl = publicUrlData.publicUrl;
    }

    if (guestImages.length > 0) {
      guests = await Promise.all(
        guests.map(async (guest) => {
          if (guest.guest_image_url.path) {
            const {
              path: filePath,
              mimetype,
              originalname,
            } = guest.guest_image_url;
            const uniqueFilename = `${uuidv4()}-${originalname}`;
            const fileContent = await fs.promises.readFile(filePath);

            // Upload to Supabase
            const { error: imageUploadError } = await supabase.storage
              .from("images")
              .upload(
                `dashboard/events/guest-images/${uniqueFilename}`,
                fileContent,
                { cacheControl: "3600", contentType: mimetype }
              );

            if (imageUploadError) {
              return { ...guest, guest_image_url: "" };
            }

            // Get public URL
            const { data: publicUrlData } = supabase.storage
              .from("images")
              .getPublicUrl(`dashboard/events/guest-images/${uniqueFilename}`);

            return {
              ...guest,
              guest_image_url: publicUrlData.publicUrl,
            };
          } else return guest;
        })
      );
    }

    const user = await User.findById(userId).select("club");
    const event = await Event.create({
      club: user.club,
      logo_url: logoUrl,
      cover_image_url: coverImageUrl,
      name,
      name_slug: formatEventName(name),
      date,
      time,
      location,
      google_maps_link: googleMapsLink,
      entry,
      internal_ticket_price: internalTicketPrice,
      external_ticket_price: externalTicketPrice,
      ticket_stands: ticketStands,
      program_steps: programSteps,
      guests,
    });

    res.status(200).json({ message: "Event added successfully", event });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else {
      res.status(500).json({ error: error.message });
    }
  } finally {
    emptyTempDirectory();
  }
};

export const editEvent = async (req, res) => {
  const userId = req.user;
  const files = req.files;

  let coverImage = null;
  let logo = null;
  let guestImages = [];

  let useExistingCoverImage = true;
  let useExistingLogo = true;

  if (files && files.coverImage) coverImage = files.coverImage[0];
  if (files && files.logo) logo = files.logo[0];
  if (files && files.guestImages) guestImages = files.guestImages;

  const {
    eventId,
    removeCoverImage,
    removeLogo,
    name,
    date,
    time,
    location,
    googleMapsLink,
    entry,
    internalTicketPrice,
    externalTicketPrice,
  } = req.body;

  let logoUrl = "";
  let coverImageUrl = "";

  let ticketStands = [];
  let programSteps = [];
  let guests = [];

  try {
    ticketStands = JSON.parse(req.body.ticketStands);
    programSteps = JSON.parse(req.body.programSteps);
    const { guests: guestsData } = JSON.parse(req.body.guests);
    guests = guestsData;

    ticketStands = ticketStands.map((stand) => {
      return {
        id: stand.id,
        date: stand.date,
        start_time: stand.startTime,
        end_time: stand.endTime,
        location: stand.location,
        google_maps_link: stand.googleMapsLink,
      };
    });

    guests = guests.map((guest) => {
      return {
        id: guest.id,
        full_name: guest.fullName,
        instagram: guest.instagram,
        linkedin: guest.linkedin,
        description: guest.description,
        guest_image_url: "",
      };
    });

    await Event.eventValidation(
      coverImage,
      logo,
      guestImages,
      name,
      date,
      time,
      location,
      googleMapsLink,
      entry,
      internalTicketPrice,
      externalTicketPrice,
      ticketStands,
      programSteps,
      guests
    );

    const eventToEdit = await Event.findById(eventId);

    guests = guests.map((guest) => ({
      ...guest,
      guest_image_url:
        guestImages.find((file) => {
          const guestId = file.originalname.split("-").slice(1, 6).join("-");
          return guestId === guest.id;
        }) ||
        eventToEdit.guests.find((targetGuest) => targetGuest.id === guest.id)
          ?.guest_image_url ||
        "",
    }));

    if (logo) {
      const filePath = logo.path;
      const fileContent = await fs.promises.readFile(filePath);

      // Fetch current user's profile data
      const oldImageName = decodeURIComponent(
        eventToEdit.logo_url.split("/").pop()
      );

      // Delete old image from Supabase if it exists
      if (oldImageName) {
        const { error: deleteImageError } = await supabase.storage
          .from("images")
          .remove([`dashboard/events/logos/${oldImageName}`]);

        if (deleteImageError) {
          throw new Error(deleteImageError.message);
        }
      }

      // Generate a new unique filename
      const uniqueFilename = `${uuidv4()}-${logo.originalname}`;

      // Upload image to Supabase
      const { error: uploadImageError } = await supabase.storage
        .from("images")
        .upload(`dashboard/events/logos/${uniqueFilename}`, fileContent, {
          cacheControl: "3600",
          upsert: false,
          contentType: logo.mimetype,
        });

      if (uploadImageError) {
        throw new Error(uploadImageError.message);
      }

      // Generate Public URL
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("images")
        .getPublicUrl(`dashboard/events/logos/${uniqueFilename}`);

      if (publicUrlError) {
        throw new Error(publicUrlError.message);
      }

      useExistingLogo = false;
      logoUrl = publicUrlData.publicUrl;
    }

    if (coverImage) {
      const filePath = coverImage.path;
      const fileContent = await fs.promises.readFile(filePath);

      // Fetch current user's profile data
      const oldImageName = decodeURIComponent(
        eventToEdit.cover_image_url.split("/").pop()
      );

      // Delete old image from Supabase if it exists
      if (oldImageName) {
        const { error: deleteImageError } = await supabase.storage
          .from("images")
          .remove([`dashboard/events/cover-images/${oldImageName}`]);

        if (deleteImageError) {
          throw new Error(deleteImageError.message);
        }
      }

      // Generate a new unique filename
      const uniqueFilename = `${uuidv4()}-${coverImage.originalname}`;

      // Upload image to Supabase
      const { error: uploadImageError } = await supabase.storage
        .from("images")
        .upload(
          `dashboard/events/cover-images/${uniqueFilename}`,
          fileContent,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: coverImage.mimetype,
          }
        );

      if (uploadImageError) {
        throw new Error(uploadImageError.message);
      }

      // Generate Public URL
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from("images")
        .getPublicUrl(`dashboard/events/cover-images/${uniqueFilename}`);

      if (publicUrlError) {
        throw new Error(publicUrlError.message);
      }

      useExistingCoverImage = false;
      coverImageUrl = publicUrlData.publicUrl;
    }

    if (removeLogo === "true") {
      const imageName = decodeURIComponent(
        eventToEdit.logo_url.split("/").pop()
      );
      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`dashboard/events/logos/${imageName}`]);

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }

      useExistingLogo = false;
      logoUrl = "";
    }

    if (removeCoverImage === "true") {
      const imageName = decodeURIComponent(
        eventToEdit.cover_image_url.split("/").pop()
      );
      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`dashboard/events/cover-images/${imageName}`]);

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }

      useExistingCoverImage = false;
      coverImageUrl = "";
    }

    await Promise.all(
      eventToEdit.guests.map(async (guestToEdit) => {
        if (
          !guests.some((guest) => guest.id === guestToEdit.id) &&
          guestToEdit.guest_image_url
        ) {
          const oldImageName = decodeURIComponent(
            guestToEdit.guest_image_url.split("/").pop()
          );

          // Delete old image from Supabase if it exists
          if (oldImageName) {
            const { error: deleteImageError } = await supabase.storage
              .from("images")
              .remove([`dashboard/events/guest-images/${oldImageName}`]);

            if (deleteImageError) {
              throw new Error(deleteImageError.message);
            }
          }
        }
      })
    );

    guests = await Promise.all(
      guests.map(async (guest) => {
        if (guest.guest_image_url.path) {
          const {
            path: filePath,
            mimetype,
            originalname,
          } = guest.guest_image_url;

          const prevGuest = await eventToEdit.guests.find(
            (prevGuest) => prevGuest.id === guest.id
          );

          if (prevGuest) {
            // Fetch current user's profile data
            const oldImageName = decodeURIComponent(
              prevGuest.guest_image_url.split("/").pop()
            );

            // Delete old image from Supabase if it exists
            if (oldImageName) {
              const { error: deleteImageError } = await supabase.storage
                .from("images")
                .remove([`dashboard/events/guest-images/${oldImageName}`]);

              if (deleteImageError) {
                throw new Error(deleteImageError.message);
              }
            }
          }

          const uniqueFilename = `${uuidv4()}-${originalname}`;
          const fileContent = await fs.promises.readFile(filePath);

          // Upload to Supabase
          const { error: uploadImageError } = await supabase.storage
            .from("images")
            .upload(
              `dashboard/events/guest-images/${uniqueFilename}`,
              fileContent,
              { cacheControl: "3600", contentType: mimetype }
            );

          if (uploadImageError) {
            return { ...guest, guest_image_url: "" };
          }

          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from("images")
            .getPublicUrl(`dashboard/events/guest-images/${uniqueFilename}`);

          return {
            ...guest,
            guest_image_url: publicUrlData.publicUrl,
          };
        } else if (guest.removeGuestImage === "true") {
          const prevGuest = await eventToEdit.guests.find(
            (prevGuest) => prevGuest.id === guest.id
          );

          const imageName = decodeURIComponent(
            prevGuest.guest_image_url.split("/").pop()
          );
          const { error } = await supabase.storage
            .from("images")
            .remove([`dashboard/events/guest-images/${imageName}`]);

          if (error) {
            return res.status(400).json({ error: error.message });
          }

          return {
            ...guest,
            guest_image_url: "",
          };
        } else return guest;
      })
    );

    const user = await User.findById(userId).select("club");
    const event = await Event.findByIdAndUpdate(
      eventId,
      {
        club: user.club,
        logo_url: useExistingLogo
          ? (
              await Event.findById(eventId)
            ).logo_url
          : logoUrl,
        cover_image_url: useExistingCoverImage
          ? (
              await Event.findById(eventId)
            ).cover_image_url
          : coverImageUrl,
        name,
        name_slug: formatEventName(name),
        date,
        time,
        location,
        google_maps_link: googleMapsLink,
        entry,
        internal_ticket_price: internalTicketPrice,
        external_ticket_price: externalTicketPrice,
        ticket_stands: ticketStands,
        program_steps: programSteps,
        guests,
      },
      { new: true }
    );

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  } finally {
    emptyTempDirectory();
  }
};

export const deleteEvent = async (req, res) => {
  const { eventId } = req.query;

  try {
    // Fetch current events image data
    const event = await Event.findById(eventId);
    const coverImageUrl = event.cover_image_url;
    const logoUrl = event.logo_url;

    // Extract filename from URL and delete old image from Supabase
    if (coverImageUrl) {
      const imageName = decodeURIComponent(coverImageUrl.split("/").pop());

      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`dashboard/events/cover-images/${imageName}`]);

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }
    }

    if (logoUrl) {
      const imageName = decodeURIComponent(logoUrl.split("/").pop());

      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`dashboard/events/logos/${imageName}`]);

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }
    }

    await Promise.all(
      event.guests.map(async (guest) => {
        if (guest.guest_image_url) {
          const imageName = decodeURIComponent(
            guest.guest_image_url.split("/").pop()
          );

          const { error: deleteImageError } = await supabase.storage
            .from("images")
            .remove([`dashboard/events/guest-images/${imageName}`]);

          if (deleteImageError) {
            throw new Error(deleteImageError.message);
          }
        }
      })
    );

    await Event.findByIdAndDelete(eventId);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
