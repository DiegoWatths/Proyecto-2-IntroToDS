const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const mobileRoutes = require("./routes/mobileRoutes")
const desktopRoutes = require("./routes/desktopRoutes")

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "localhost";

app.use(mobileRoutes);
app.use(desktopRoutes);

app.listen(PORT, () => console.log(`El servicio del proxy 1 está en http://${HOST}:${PORT}`))