const fs = require ("fs")

 const deleteOldProfile = (url) => {
  const idx = url.indexOf("/uploads/");
  const fileToDeletePath = url
    .replace(url.substring(0, idx), "./public/")
    .replaceAll("/", "\\");

  try {
    fs.unlinkSync(fileToDeletePath);
  } catch (error) {
    console.log("Error", error.message);
  }
  console.log(fileToDeletePath);
}

module.exports = deleteOldProfile