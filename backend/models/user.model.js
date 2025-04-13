import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = mongoose.Schema(
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
      required: true,
      enum: [
        "entrepreneuriat",
        "enactus",
        "the-great-debaters",
        "eco-club",
        "sharks-football",
        "sharks-basketball",
        "sharks-taekwondo",
        "sharks-volleyball",
        "sharks-chess",
        "sharks-handball",
        "jlm",
        "lions",
        "unleashed",
        "cop",
        "cdi",
        "rcc",
        "aikido-club-samurai",
        "rotaracat",
        "sport-for-dev",
        "kiproko",
        "riu",
        "pressnap",
        "sankofa",
        "tolerance",
        "7th-art",
        "is-club",
        "vinyl",
        "ultras-rebirth",
        "jtc",
        "assais",
        "hanmate",
      ],
    },
    board_position: {
      type: String,
      required: true,
      enum: [
        "president",
        "vice-president",
        "treasurer",
        "general-secretary",
        "communications-manager",
        "human-ressources-manager",
        "logistics-manager",
      ],
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    role: {
      type: [String],
      enum: ["admin", "board-member", "editor"],
      required: true,
      default: ["board-member"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "signed-up"],
      default: "pending",
    },
    phone: {
      type: Number,
      default: null,
    },
    description: {
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
    profile_image_url: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// static request signup method
userSchema.statics.requestSignup = async function (
  first_name,
  last_name,
  club,
  board_position,
  isEditor,
  phone,
  email
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

  if (!club) {
    validationErrors.push({
      element: ["club"],
      message: "Please select your club",
    });
  }

  if (!board_position) {
    validationErrors.push({
      element: ["board_position"],
      message: "Please select your board position",
    });
  }

  const editorRoleOccupied = await this.findOne({
    club,
    role: "editor",
  });
  if (club && isEditor && editorRoleOccupied) {
    validationErrors.push({
      element: ["role"],
      message: "The editor role is already occupied",
    });
  }

  if (!phone) {
    validationErrors.push({
      element: ["phone"],
      message: "Phone cannot be blank",
    });
  }

  if (phone && !/^[67]\d{8}$/.test(phone.toString())) {
    validationErrors.push({
      element: ["phone"],
      message: "Phone number must be exactly 9 digits and start with 6 or 7",
    });
  }

  if (!email) {
    validationErrors.push({
      element: ["email"],
      message: "Email cannot be blank",
    });
  }

  if (!validator.isEmail(email)) {
    validationErrors.push({
      element: ["email"],
      message: "Email is not valid",
    });
  }

  const emailExists = await this.findOne({ email });
  if (emailExists) {
    validationErrors.push({
      element: ["email"],
      message: "Email already in use",
    });
  }

  const positionOccupied = await this.findOne({
    club,
    board_position,
    status: { $in: ["approved", "signed-up"] },
  });
  if (positionOccupied) {
    validationErrors.push({
      element: ["club", "board_position"],
      message:
        "Position occupied, make sure you selected the right club and position",
    });
  }

  if (validationErrors.length > 0) {
    throw { validationErrors };
  }

  const user = await this.create({
    first_name,
    last_name,
    club,
    board_position,
    role: isEditor ? ["board-member", "editor"] : ["board-member"],
    phone,
    email,
  });

  return user;
};

// static signup method
userSchema.statics.signup = async function (email, password) {
  let validationErrors = [];

  if (!password) {
    validationErrors.push({
      element: ["password"],
      message: "Password cannot be blank",
    });
  }

  if (password && !validator.isStrongPassword(password)) {
    validationErrors.push({
      element: ["password"],
      message: "Password not strong enough",
    });
  }

  if (validationErrors.length > 0) {
    throw { validationErrors };
  }

  const userSignedup = await this.findOne({ email, status: "signed-up" });
  if (userSignedup) {
    validationErrors.push({
      element: ["password"],
      message: "You're already signed up! Please log in to continue",
    });
  }

  if (validationErrors.length > 0) {
    throw { validationErrors };
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.findOneAndUpdate(
    { email },
    { password: hash, status: "signed-up" },
    { new: true }
  ).select("-password");

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  let validationErrors = [];

  if (!email) {
    validationErrors.push({
      element: ["email"],
      message: "Email cannot be blank",
    });
  }

  if (!password) {
    validationErrors.push({
      element: ["password"],
      message: "Password cannot be blank",
    });
  }

  if (validationErrors.length > 0) {
    throw { validationErrors };
  }

  const user = await this.findOne({ email });

  if (!user) {
    validationErrors.push({
      element: ["email"],
      message: "No user with that email.",
    });
  } else {
    const approved = user.status === "approved" || user.status === "signed-up";
    if (!approved) {
      validationErrors.push({
        element: ["email"],
        message: "Your request to sign up has not been approved yet.",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      validationErrors.push({
        element: ["password"],
        message: "Incorrect password.",
      });
    }
  }

  if (validationErrors.length > 0) {
    throw { validationErrors };
  }

  const authenticatedUser = await this.findOne({ email }).select("-password");

  return authenticatedUser;
};

// static approve request method
userSchema.statics.approveRequest = async function (id) {
  const user = await this.findByIdAndUpdate(id, { status: "approved" });

  await this.deleteMany({
    _id: { $ne: id },
    club: user.club,
    board_position: user.board_position,
    status: "pending",
  });

  return user;
};

// static update profile info method
userSchema.statics.updateProfileInfo = async function (
  id,
  first_name,
  last_name,
  email,
  phone,
  description,
  instagram,
  linkedin,
  facebook
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

  if (!email) {
    validationErrors.push({
      element: ["email"],
      message: "Email cannot be blank",
    });
  }

  if (!validator.isEmail(email)) {
    validationErrors.push({
      element: ["email"],
      message: "Email is not valid",
    });
  }

  const emailExists = await this.findOne({ _id: { $ne: id }, email });
  if (emailExists) {
    validationErrors.push({
      element: ["email"],
      message: "Email already in use",
    });
  }

  if (!phone) {
    validationErrors.push({
      element: ["phone"],
      message: "Phone cannot be blank",
    });
  }

  if (phone && !/^[67]\d{8}$/.test(phone.toString())) {
    validationErrors.push({
      element: ["phone"],
      message: "Phone number must be exactly 9 digits and start with 6 or 7",
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

  const user = await this.findByIdAndUpdate(
    id,
    {
      first_name,
      last_name,
      email,
      phone,
      description,
      instagram,
      linkedin,
      facebook,
    },
    { new: true }
  );

  return user;
};

// static verify password method
userSchema.statics.verifyPassword = async function (id, password) {
  let validationErrors = [];

  if (!password) {
    validationErrors.push({
      element: ["old_password"],
      message: "Password cannot be blank",
    });
  }

  if (validationErrors.length > 0) {
    throw { validationErrors };
  }

  const user = await this.findById(id);

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    validationErrors.push({
      element: ["old_password"],
      message: "Incorrect password.",
    });
  }

  if (validationErrors.length > 0) {
    throw { validationErrors };
  }
};

// static updatePassword method
userSchema.statics.updatePassword = async function (id, password) {
  let validationErrors = [];

  if (!password) {
    validationErrors.push({
      element: ["new_password"],
      message: "Password cannot be blank",
    });
  }

  if (password && !validator.isStrongPassword(password)) {
    validationErrors.push({
      element: ["new_password"],
      message: "Password not strong enough",
    });
  }

  if (validationErrors.length > 0) {
    throw { validationErrors };
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await this.findByIdAndUpdate(id, { password: hash });
};

const User = mongoose.model("User", userSchema);

export default User;
