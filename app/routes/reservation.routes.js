module.exports = app => {
    const reservations = require("../controllers/reservation.controller.js");

    var router = require("express").Router();

    // Create a Reservation
    router.post("/", reservations.create);

    // Retrieve all reservations within time-interval (starttime)
    router.get("/", reservations.findAllForTime);

    // Retrieve a single Reservation with id
    router.get("/:id", reservations.findOne);

    // Update a Reservation with id
    router.put("/:id", reservations.update);

    // Delete a Reservation with id
    router.delete("/:id", reservations.delete);

    app.use("/reservation", router);
};