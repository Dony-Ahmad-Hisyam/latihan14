const express = require("express");
const trasmisiRouter = require("./routes/trasmisi");
const kendaraanRouter = require("./routes/kendaraan");
const bodyPrs = require("body-parser");
const app = express();
const port = 8080;

app.use(bodyPrs.urlencoded({ extended: false }));
app.use(bodyPrs.json());

app.use("/api/transmisi", trasmisiRouter);
app.use("/api/kendaraan", kendaraanRouter);

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
