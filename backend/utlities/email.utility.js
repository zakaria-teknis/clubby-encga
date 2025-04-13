import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const formatClub = (club) => {
  let formattedClub = club;

  formattedClub = formattedClub
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (club === "jlm") formattedClub = "Jeunes Leaders Marocains";
  if (club === "cop") formattedClub = "Club d'Orientation Pédagogique";
  if (club === "cdi") formattedClub = "Club du Digital et de l'Innovation";
  if (club === "rcc") formattedClub = "Readers' Corner Club";
  if (club === "sport-for-dev") formattedClub = "Sport For Development";
  if (club === "is-club") formattedClub = "International Student Club";
  if (club === "jtc") formattedClub = "Junior Traders Club";

  return formattedClub;
};

const formatString = (string) => {
  return string
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const approvedUserEmail = async (
  first_name,
  last_name,
  club,
  board_position,
  email,
  signupToken
) => {
  const mailOptions = {
    from: `"Clubby Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Approved request to join Clubby`,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px; max-width: 600px; margin: auto;">
            <h1 style="color: #333; text-align: center;">Your Request to Join Clubby Has Been Approved!</h1>
            <p style="font-size: 16px; color: #555;">Dear <strong>
            ${formatString(first_name)} 
            ${formatString(last_name)}</strong>,</p>
            <p style="font-size: 16px; color: #555;">We are excited to inform you that your request to join Clubby has been approved.</p>

            <div style="margin-bottom: 20px;">
             <p style="font-size: 16px; color: #555;"><strong>Club:</strong> 
             ${formatClub(club)}
             </p>
             <p style="font-size: 16px; color: #555;"><strong>Position:</strong> 
             ${formatString(board_position)}
             </p>
            </div>

            <p style="font-size: 16px; color: #555;">To complete your registration, please click the button below. Please note that <strong>this link is only valid for 72 hours</strong>. After that, you will need to send a new request.</p>

            <div style="text-align: center; margin-top: 36px;">
             <a href="
             ${
               process.env.SIGNUP_URL
             }/signup?signupToken=${signupToken}" style="background-color: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Sign Up</a>
            </div>
          </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const rejectedUserEmail = async (
  first_name,
  last_name,
  club,
  board_position,
  email
) => {
  const mailOptions = {
    from: `"Clubby Admin" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Approved request to join Clubby`,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px; max-width: 600px; margin: auto;">
            <h1 style="color: #333; text-align: center;">Your Application to Join Clubby</h1>
            <p style="font-size: 16px; color: #555;">Dear <strong>
            ${formatString(first_name)} 
            ${formatString(last_name)}</strong>,</p>
            <p style="font-size: 16px; color: #555;">Thank you for your interest in the <strong>
            ${formatString(board_position)}
            </strong> position at the club: <strong>
            ${formatClub(club)}
            </strong>. After careful consideration, we regret to inform you that we will not be proceeding with your application. We appreciate the time and effort you invested and wish you success in your future endeavors.</p>
            <p style="font-size: 16px; color: #555;">Sincerely,</p>
            <p style="font-size: 16px; color: #555;">The Clubby Team</p>
           </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error.message);
  }
};
