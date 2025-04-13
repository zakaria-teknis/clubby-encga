import mongoose from "mongoose";
import validator from "validator";
import User from "./user.model.js";

const clubSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    logo_url: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// static update club info method
clubSchema.statics.updateClubInfo = async function (
  userId,
  clubId,
  email,
  phone,
  description,
  website,
  instagram,
  linkedin,
  facebook
) {
  let validationErrors = [];

  if (email && !validator.isEmail(email)) {
    validationErrors.push({
      element: ["email"],
      message: "Email is not valid",
    });
  }

  if (email) {
    const emailExists = await this.findOne({ _id: { $ne: clubId }, email });
    if (emailExists) {
      validationErrors.push({
        element: ["email"],
        message: "Email already in use",
      });
    }
  }

  if (phone && !/^[67]\d{8}$/.test(phone.toString())) {
    validationErrors.push({
      element: ["phone"],
      message: "Phone number must be exactly 9 digits and start with 6 or 7",
    });
  }

  if (
    website &&
    !/^https?:\/\/(?:www\.)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d+)?(?:\/[^\s?#]*)?(?:\?[^\s#]*)?(?:#\S*)?$/.test(
      website.toString()
    )
  ) {
    validationErrors.push({
      element: ["website"],
      message: "Invalid Website URL",
    });
  }

  if (
    instagram &&
    !/^https:\/\/www\.instagram\.com\/[a-zA-Z0-9._]{1,30}\/?$/.test(
      instagram.toString()
    )
  ) {
    validationErrors.push({
      element: ["instagram"],
      message: "Invalid URL",
    });
  }

  if (
    linkedin &&
    !/^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9_-]{1,100}\/?$/.test(
      linkedin.toString()
    )
  ) {
    validationErrors.push({
      element: ["linkedin"],
      message: "Invalid URL",
    });
  }

  if (
    facebook &&
    !/^https:\/\/www\.facebook\.com\/(?:[a-zA-Z0-9._]+|profile\.php\?id=\d+)\/?$/.test(
      facebook.toString()
    )
  ) {
    validationErrors.push({
      element: ["facebook"],
      message: "Invalid URL",
    });
  }

  if (validationErrors.length > 0) {
    throw { validationErrors };
  }

  const user = await User.findById(userId).select("club");
  const club = await this.findOneAndUpdate(
    { name: user.club },
    {
      email,
      phone,
      description,
      website,
      instagram,
      linkedin,
      facebook,
    },
    { new: true }
  );

  return club;
};

const Club = mongoose.model("Club", clubSchema);

export default Club;
