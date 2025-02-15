const express = require("express");

const app = express();

const port = process.env.PORT || 5009;

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!!!!");
});

app.listen(port, () =>
  console.log(`Server is listening on port http://localhost:${port}`)
);
