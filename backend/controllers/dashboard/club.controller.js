import Club from "../../models/club.model.js";
import { supabase } from "../../utlities/supabase.utility.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import emptyTempDirectory from "../../utlities/emptyTempDirectory.utility.js";

export const updateClubInfo = async (req, res) => {
  const userId = req.user;
  const {
    clubId,
    email,
    phone,
    description,
    website,
    instagram,
    linkedin,
    facebook,
  } = req.body;

  try {
    const club = await Club.updateClubInfo(
      userId,
      clubId,
      email,
      phone,
      description,
      website,
      instagram,
      linkedin,
      facebook
    );

    res.status(200).json({ message: "Club updated successfully", club });
  } catch (error) {
    if (error.validationErrors) {
      return res.status(400).json({ validationErrors: error.validationErrors });
    } else res.status(500).json({ error: error.message });
  }
};

export const updateClubLogo = async (req, res) => {
  const { clubId } = req.body;
  const logo = req.file;
  const filePath = logo.path;
  const fileContent = await fs.promises.readFile(filePath);

  try {
    // Fetch club's profile data
    const club = await Club.findById(clubId);
    const oldLogoName = decodeURIComponent(club.logo_url.split("/").pop());

    // Delete old logo from Supabase if it exists
    if (oldLogoName) {
      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`dashboard/clubs/logos/${oldLogoName}`]);

      if (deleteImageError) {
        return res.status(400).json({ error: deleteImageError.message });
      }
    }

    // Generate a new unique filename
    const uniqueFilename = `${uuidv4()}-${logo.originalname}`;

    // Upload image to Supabase
    const { error: uploadImageError } = await supabase.storage
      .from("images")
      .upload(`dashboard/clubs/logos/${uniqueFilename}`, fileContent, {
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
      .getPublicUrl(`dashboard/clubs/logos/${uniqueFilename}`);

    if (publicUrlError) {
      throw new Error(publicUrlError.message);
    }

    const logoUrl = publicUrlData.publicUrl;

    await Club.findByIdAndUpdate(clubId, { logo_url: logoUrl }, { new: true });

    res.status(200).json({ message: "Logo updated successfully", logoUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    emptyTempDirectory();
  }
};

export const deleteClubLogo = async (req, res) => {
  const { clubId } = req.query;
  try {
    // Fetch current club's profile data
    const club = await Club.findById(clubId);
    const logoUrl = club.logo_url;

    // Extract filename from URL and delete old logo from Supabase
    if (logoUrl) {
      const imageName = decodeURIComponent(logoUrl.split("/").pop());

      const { error: deleteImageError } = await supabase.storage
        .from("images")
        .remove([`dashboard/clubs/logos/${imageName}`]);

      if (deleteImageError) {
        throw new Error(deleteImageError.message);
      }

      await Club.updateOne({ _id: clubId }, { logo_url: "" });
    }

    res.status(200).json({ message: "Logo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
