import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import dotenv from "dotenv";

dotenv.config();

export default async function emptyTempDirectory() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const tempDir = path.join(__dirname, "..", process.env.TMP_PATH);
    const files = await fs.readdir(tempDir);
    await Promise.all(files.map((file) => fs.unlink(path.join(tempDir, file))));
  } catch (error) {
    console.log(error.message);
  }
}
