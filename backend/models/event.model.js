import mongoose from "mongoose";
import fs from "fs";

const eventSchema = mongoose.Schema(
  {
    club: {
      type: String,
    },
    logo_url: {
      type: String,
      default: "",
    },
    cover_image_url: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    name_slug: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "",
    },
    time: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    google_maps_link: {
      type: String,
      default: "",
    },
    entry: {
      type: String,
      enum: ["free", "paid"],
    },
    internal_ticket_price: {
      type: Number,
      default: null,
    },
    external_ticket_price: {
      type: Number,
      default: null,
    },
    ticket_stands: [
      {
        id: { type: String },
        date: { type: String },
        start_time: { type: String },
        end_time: { type: String },
        location: {
          type: String,
        },
        google_maps_link: {
          type: String,
        },
      },
    ],
    program_steps: [
      {
        id: { type: String },
        title: { type: String },
        date: { type: String },
        time: { type: String },
        description: { type: String },
      },
    ],
    guests: [
      {
        id: { type: String },
        full_name: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        description: { type: String },
        guest_image_url: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

eventSchema.statics.eventValidation = async function (
  coverImage,
  logo,
  guestImages,
  name,
  date,
  time,
  location,
  google_maps_link,
  entry,
  internal_ticket_price,
  external_ticket_price,
  ticket_stands,
  program_steps,
  guests
) {
  let validationErrors = [];

  if (!name) {
    validationErrors.push({
      element: ["name"],
      message: "Name cannot be blank",
    });
  }

  if (name && !/^[A-Za-z0-9\s]+$/.test(name)) {
    validationErrors.push({
      element: ["name"],
      message:
        "Name cannot contain special characters (e.g. , . ! @ # $ % & *)",
    });
  }

  if (!date) {
    validationErrors.push({
      element: ["date"],
      message: "Please select a date",
    });
  }

  if (date && !time) {
    validationErrors.push({
      element: ["time"],
      message: "Please select a time",
    });
  }

  if (!location && !google_maps_link) {
    validationErrors.push({
      element: ["location", "google_maps_link"],
      message: "Please provide either a location or google maps link",
    });
  }

  if (
    google_maps_link &&
    !/^https?:\/\/((www\.)?google\.com\/maps\/|goo\.gl\/maps\/|maps\.app\.goo\.gl\/)\S+$/.test(
      google_maps_link.toString()
    )
  ) {
    validationErrors.push({
      element: ["google_maps_link"],
      message: "Invalid link",
    });
  }

  if (!entry) {
    validationErrors.push({
      element: ["entry"],
      message: "Please select an entry option",
    });
  }

  if (entry && entry === "paid" && !internal_ticket_price) {
    validationErrors.push({
      element: ["internal_ticket_price"],
      message: "Internal ticket price cannot be blank",
    });
  }

  if (
    entry &&
    entry === "paid" &&
    external_ticket_price &&
    !internal_ticket_price
  ) {
    validationErrors.push({
      element: ["internal_ticket_price"],
      message: "Internal ticket price cannot be blank",
    });
  }

  if (ticket_stands && ticket_stands.length > 0) {
    ticket_stands.map((stand) => {
      if (!stand.date) {
        validationErrors.push({
          id: stand.id,
          array: "ticket_stands",
          element: ["date"],
          message: "Date cannot be blank",
        });
      }

      if (stand.date && !stand.start_time) {
        validationErrors.push({
          id: stand.id,
          array: "ticket_stands",
          element: ["start_time"],
          message: "Please select a start time",
        });
      }

      if (stand.start_time && !stand.end_time) {
        validationErrors.push({
          id: stand.id,
          array: "ticket_stands",
          element: ["end_time"],
          message: "Please select an end time",
        });
      }

      if (!stand.location && !stand.google_maps_link) {
        validationErrors.push({
          id: stand.id,
          array: "ticket_stands",
          element: ["location", "google_maps_link"],
          message: "Please provide either a location or google maps link",
        });
      }

      if (
        stand.google_maps_link &&
        !/^https?:\/\/((www\.)?google\.com\/maps\/|goo\.gl\/maps\/|maps\.app\.goo\.gl\/)\S+$/.test(
          stand.google_maps_link.toString()
        )
      ) {
        validationErrors.push({
          id: stand.id,
          array: "ticket_stands",
          element: ["google_maps_link"],
          message: "Invalid link",
        });
      }
    });
  }

  if (program_steps && program_steps.length > 0) {
    program_steps.map((step) => {
      if (!step.title) {
        validationErrors.push({
          id: step.id,
          array: "program_steps",
          element: ["title"],
          message: "Title cannot be blank",
        });
      }

      if (!step.date) {
        validationErrors.push({
          id: step.id,
          array: "program_steps",
          element: ["date"],
          message: "Please select a date",
        });
      }

      if (step.date && !step.time) {
        validationErrors.push({
          id: step.id,
          array: "program_steps",
          element: ["time"],
          message: "Please select a time",
        });
      }
    });
  }

  if (guests && guests.length > 0) {
    guests.map((guest) => {
      if (!guest.full_name) {
        validationErrors.push({
          id: guest.id,
          array: "guests",
          element: ["full_name"],
          message: "Full name cannot be blank",
        });
      }

      if (
        guest.instagram &&
        !/^https:\/\/www\.instagram\.com\/[a-zA-Z0-9._]{1,30}\/?$/.test(
          guest.instagram.toString()
        )
      ) {
        validationErrors.push({
          id: guest.id,
          array: "guests",
          element: ["instagram"],
          message: "Invalid URL",
        });
      }

      if (
        guest.linkedin &&
        !/^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]{1,100}\/?$/.test(
          guest.linkedin.toString()
        )
      ) {
        validationErrors.push({
          id: guest.id,
          array: "guests",
          element: ["linkedin"],
          message: "Invalid URL",
        });
      }

      if (!guest.description) {
        validationErrors.push({
          id: guest.id,
          array: "guests",
          element: ["description"],
          message: "Description cannot be blank",
        });
      }
    });
  }

  if (validationErrors.length > 0) {
    if (coverImage) {
      await fs.promises.unlink(coverImage.path);
    }
    if (logo) {
      await fs.promises.unlink(logo.path);
    }
    if (guestImages && guestImages.length > 0) {
      await Promise.all(
        guestImages.map((image) => {
          fs.promises.unlink(image.path);
        })
      );
    }
    throw { validationErrors };
  }
};

const Event = mongoose.model("Event", eventSchema);

export default Event;
