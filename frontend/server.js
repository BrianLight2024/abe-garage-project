// Import express and path modules.
const express = require("express");
const path = require("path");
// Create an express app.
const app = express();
// Serve the static files from the React app.
app.use(express.static(path.join(__dirname, "build")));
// Redirect every request to index.html
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
// Listen to the default port 80
app.listen(80);
