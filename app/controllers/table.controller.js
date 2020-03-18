const db = require("../models");
const Table = db.tables;

// Retrieve all tables
exports.findAll = (req, res) => {
    Table.findAll({ where: {} })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some internal error occured while retrieving tables."
            });
        });
};

// Create new Table
exports.create = (req, res) => {
    // Validate request
    if (!req.body.chairs) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Table
    const table = {
        chairs: req.body.chairs
    }

    // Save Table in database
    Table.create(table)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some internal error occured while creating the Table"
            });
        });
};