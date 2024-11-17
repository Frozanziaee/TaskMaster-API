const path = requir ("path")
const { fileURLToPath } = require ("url")
const fs = requir ("fs")

// Define __dirname manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default function deleteOldProfile(url) {
  const idx = url.indexOf("/uploads/");
  const fileToDeletePath = url
    // .replace(url.substring(0, idx), __dirname)
    .replace(url.substring(0, idx), "./public/")
    .replaceAll("/", "\\");

  try {
    fs.unlinkSync(fileToDeletePath);
  } catch (error) {
    console.log("Error", error.message);
  }
  console.log(fileToDeletePath);
}