module.exports = app => {
    const tables = require("../controllers/table.controller.js");

    var router = require("express").Router();

    // Retrieve all tables
    router.get("/", tables.findAll);

    // Create table
    router.post("/", tables.create);

    app.use("/table", router);
};