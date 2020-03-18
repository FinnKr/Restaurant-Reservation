const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "https://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Restaurant reservation route base endpoint." });
});

const db = require("./app/models");
db.sequelize.sync();                                    // Production
// db.sequelize.sync({ force: true }).then(() => {     // Development
//     console.log("Drop and re-sync db.");
// });

require("./app/routes/reservation.routes")(app);
require("./app/routes/table.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});