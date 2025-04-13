import User from "../../models/user.model.js";
import Member from "../../models/member.model.js";
import { supabase } from "../../utlities/supabase.utility.js";
import emptyTempDirectory from "../../utlities/emptyTempDirectory.utility.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const getMembers = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id).select("club");

    const members = await Member.find({
      club: user.club,
    }).select("-club");
    res.status(200).json({ members });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMember = async (req, res) => {
  const id = req.user;
  const profileImage = req.file;
  const { firstName, lastName, email, phone, paidMembershipFee } = req.body;
  let profileImageUrl = "";

  try {
    await Member.addMemberValidation(
      firstName,
      lastName,
      email,
      phone,
      profileImage
    );

    if (profileImage) {
      const filePath = profileImage.path;
      const fileContent = await fs.promises.readFile(filePath);

      // Generate a new unique filename
      const uniqueFilename = `${uuidv4()}-${profileImage.originalname}`;

      // Upload image to Supabase
      const { error: uploadImageError } = await supabase.storage
        .from("images")
        .upload(
          `dashboard/members/profile-images/${uniqueFilename}`,
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
        .getPublicUrl(`dashboard/members/profile-images/${uniqueFilename}`);

      if (publicUrlError) {
        throw new Error(publicUrlError.message);
      }

      profileImageUrl = publicUrlData.publicUrl;
    }

    const user = await User.findById(id).select("club");
    const member = await Member.create({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      paid_membership_fee: paidMembershipFee,
      club: user.club,
      profile_image_url: profileImageUrl,
    });

    res.status(200).json({ message: "Member added successfully", member });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else res.status(500).json({ error: error.message });
  } finally {
    emptyTempDirectory();
  }
};

export const updateMember = async (req, res) => {
  const profileImage = req.file;
  const {
    memberId,
    firstName,
    lastName,
    email,
    phone,
    paidMembershipFee,
    removeImage,
  } = req.body;

  let useExistingImage = true;
  let profileImageUrl = "";

  try {
    await Member.updateMemberValidation(
      memberId,
      firstName,
      lastName,
      email,
      phone,
      profileImage
    );

    if (profileImage) {
      const filePath = profileImage.path;
      const fileContent = await fs.promises.readFile(filePath);

      // Fetch current member's profile data
      const member = await Member.findById(memberId);
      const oldImageName = decodeURIComponent(
        member.profile_image_url.split("/").pop()
      );

      // Delete old image from Supabase if it exists
      if (oldImageName) {
        const { error: deleteImageError } = await supabase.storage
          .from("images")
          .remove([`dashboard/members/profile-images/${oldImageName}`]);

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
          `dashboard/members/profile-images/${uniqueFilename}`,
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
        .getPublicUrl(`dashboard/members/profile-images/${uniqueFilename}`);

      if (publicUrlError) {
        throw new Error(publicUrlError.message);
      }

      useExistingImage = false;
      profileImageUrl = publicUrlData.publicUrl;
    }

    if (removeImage === "true") {
      const member = await Member.findById(memberId);
      const imageName = decodeURIComponent(
        member.profile_image_url.split("/").pop()
      );
      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`dashboard/members/profile-images/${imageName}`]);

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }

      useExistingImage = false;
      profileImageUrl = "";
    }

    const member = await Member.findByIdAndUpdate(
      memberId,
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        paid_membership_fee: paidMembershipFee,
        profile_image_url: useExistingImage
          ? (
              await Member.findById(memberId)
            ).profile_image_url
          : profileImageUrl,
      },
      { new: true }
    );

    res.status(200).json({ message: "Member updated successfully", member });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else res.status(500).json({ error: error.message });
  } finally {
    emptyTempDirectory();
  }
};

export const deleteMember = async (req, res) => {
  const { memberId } = req.query;

  try {
    // Fetch current member's profile data
    const member = await Member.findById(memberId);
    const profileImageUrl = member.profile_image_url;

    // Extract filename from URL and delete old image from Supabase
    if (profileImageUrl) {
      const imageName = decodeURIComponent(profileImageUrl.split("/").pop());

      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`dashboard/members/profile-images/${imageName}`]);

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }
    }
    await Member.findByIdAndDelete(memberId);
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
