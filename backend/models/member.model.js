import mongoose from "mongoose";
import validator from "validator";
import fs from "fs";

const memberSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    club: {
      type: String,
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: Number,
      default: null,
    },
    paid_membership_fee: {
      type: String,
      enum: ["paid", "unpaid", ""],
      default: "",
    },
    profile_image_url: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// static add member method
memberSchema.statics.addMemberValidation = async function (
  first_name,
  last_name,
  email,
  phone,
  profileImage
) {
  let validationErrors = [];

  if (!first_name) {
    validationErrors.push({
      element: ["first_name"],
      message: "First name cannot be blank",
    });
  }

  if (!last_name) {
    validationErrors.push({
      element: ["last_name"],
      message: "Last name cannot be blank",
    });
  }

  if (email && !validator.isEmail(email)) {
    validationErrors.push({
      element: ["email"],
      message: "Email is not valid",
    });
  }

  if (email) {
    const emailExists = await this.findOne({ email });
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

  if (validationErrors.length > 0) {
    if (profileImage) {
      await fs.promises.unlink(profileImage.path);
    }
    throw { validationErrors };
  }
};

memberSchema.statics.updateMemberValidation = async function (
  id,
  first_name,
  last_name,
  email,
  phone,
  profileImage
) {
  let validationErrors = [];

  if (!first_name) {
    validationErrors.push({
      element: ["first_name"],
      message: "First name cannot be blank",
    });
  }

  if (!last_name) {
    validationErrors.push({
      element: ["last_name"],
      message: "Last name cannot be blank",
    });
  }

  if (email && !validator.isEmail(email)) {
    validationErrors.push({
      element: ["email"],
      message: "Email is not valid",
    });
  }

  if (email) {
    const emailExists = await this.findOne({ _id: { $ne: id }, email });
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

  if (validationErrors.length > 0) {
    if (profileImage) {
      await fs.promises.unlink(profileImage.path);
    }
    throw { validationErrors };
  }
};

const Member = mongoose.model("Member", memberSchema);

export default Member;
