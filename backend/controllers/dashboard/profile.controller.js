import User from "../../models/user.model.js";
import { supabase } from "../../utlities/supabase.utility.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import emptyTempDirectory from "../../utlities/emptyTempDirectory.utility.js";

export const updateProfileInfo = async (req, res) => {
  const id = req.user;
  const {
    first_name,
    last_name,
    email,
    phone,
    description,
    instagram,
    linkedin,
    facebook,
  } = req.body;

  try {
    const user = await User.updateProfileInfo(
      id,
      first_name,
      last_name,
      email,
      phone,
      description,
      instagram,
      linkedin,
      facebook
    );

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else res.status(500).json({ error: error.message });
  }
};

export const updateProfileImage = async (req, res) => {
  const id = req.user;
  const profileImage = req.file;
  const filePath = profileImage.path;
  const fileContent = await fs.promises.readFile(filePath);

  try {
    // Fetch current user's profile data
    const user = await User.findById(id);
    const oldImageName = decodeURIComponent(
      user.profile_image_url.split("/").pop()
    );

    // Delete old image from Supabase if it exists
    if (oldImageName) {
      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`dashboard/profile/profile-images/${oldImageName}`]);

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }
    }

    // Generate a new unique filename
    const uniqueFilename = `${uuidv4()}-${profileImage.originalname}`;

    // Upload image to Supabase
    const { error: uploadImageError } = await supabase.storage
      .from("images")
      .upload(
        `dashboard/profile/profile-images/${uniqueFilename}`,
        fileContent,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: profileImage.mimetype,
        }
      );

    if (uploadImageError) {
      throw new Error(uploadImageError.message);
    }

    // Generate Public URL
    const { data: publicUrlData, error: publicUrlError } = supabase.storage
      .from("images")
      .getPublicUrl(`dashboard/profile/profile-images/${uniqueFilename}`);

    if (publicUrlError) {
      return res.status(400).json({ error: "Failed to generate public URL" });
    }

    const profileImageUrl = publicUrlData.publicUrl;

    await User.findByIdAndUpdate(
      id,
      { profile_image_url: profileImageUrl },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Profile image updated successfully", profileImageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    emptyTempDirectory();
  }
};

export const deleteProfileImage = async (req, res) => {
  const id = req.user;
  try {
    // Fetch current user's profile data
    const user = await User.findById(id);
    const profileImageUrl = user.profile_image_url;

    // Extract filename from URL and delete old image from Supabase
    if (profileImageUrl) {
      const imageName = decodeURIComponent(profileImageUrl.split("/").pop());

      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`dashboard/profile/profile-images/${imageName}`]);

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }

      await User.updateOne({ _id: id }, { profile_image_url: "" });
    }

    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
