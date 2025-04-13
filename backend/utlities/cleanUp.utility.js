import cron from "node-cron";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to delete all files in the temp folder
async function deleteTempFiles() {
  const tempDir = path.join(__dirname, "..", "temp");
  try {
    const files = await fs.readdir(tempDir);
    for (const file of files) {
      await fs.unlink(path.join(tempDir, file));
    }
  } catch (error) {
    console.error("Error deleting temporary files.");
  }
}

// Function to delete users with an updatedAt older than 3 days and status "approved"
async function deleteOldApprovedUsers() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  try {
    await User.deleteMany({
      status: "approved",
      updatedAt: { $lt: threeDaysAgo },
    });
  } catch (error) {
    console.error("Error deleting old approved users");
  }
}

// Schedule tasks to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled tasks...");
  await deleteTempFiles();
  await deleteOldApprovedUsers();
});
