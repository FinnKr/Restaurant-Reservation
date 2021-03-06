const db = require("../models");
const nodemailer = require('nodemailer'); 
const Reservation = db.reservations;
const Op = db.Sequelize.Op;
const reservDuration = 2;

// Create and Save Reservation
exports.create = (req, res) => {
    // Validate request
    if (!req.body.starttime || !req.body.name || !req.body.mail || !req.body.tableid) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Reservation
    const reservation = {
        starttime: req.body.starttime,
        name: req.body.name,
        mail: req.body.mail,
        tableid: req.body.tableid
    }

    // Save Reservation in database
    Reservation.create(reservation)
        .then(data => {

            var transporter = nodemailer.createTransport({
                host: "localhost",
                port: 465,
                secure: true,
                auth: {
                  user: 'hwr@berlin-fn.de',
                  pass: 'zzightio44'
                },
		tls: {
			rejectUnauthorized: false
		}
              });
              
              var mailOptions = {
                from: 'hwr@berlin-fn.de',
                to: reservation.mail,
                subject: 'Restaurant HWR Reservierung',
                text: 'Sie haben eine neue Reservierung um ' + reservation.starttime + " im HWR Restaurant. <br>Um die Reservierung zu bearbeiten oder zu löschen klicken Sie auf folgenden Link:<br><a href='http://berlin-fn.de:4200'>http://berlin-fn.de:4200</a>",
                html: 'Sie haben eine neue Reservierung um ' + reservation.starttime + " im HWR Restaurant. <br>Um die Reservierung zu bearbeiten oder zu löschen klicken Sie auf folgenden Link:<br><a href='http://berlin-fn.de:4200'>http://berlin-fn.de:4200</a>"
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                  res.status(500).send({message: "Fehler beim Mailversand"});
                } else {
                  console.log('Email sent: ' + info.response);
                  res.send(data);
                }
              }); 
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some internal error occured while creating the Reservation"
            });
        });
};

// Retrieve all Reservations for specific time
exports.findAllForTime = (req, res) => {
    const starttime = new Date(req.query.starttime);
    //const endtime = new Date(starttime + (reservDuration*60*60*1000));
    const endtime = new Date(starttime);
    endtime.setHours(starttime.getHours() + reservDuration);
    const shiftedstarttime = new Date(starttime - (reservDuration*60*60*1000));

    Reservation.findAll({ where: {[Op.or]: [ 
            {
                starttime: {[Op.between]: [
                    starttime, endtime
                ]}
            },
            {
                starttime: {[Op.between]: [
                    shiftedstarttime, starttime
                ]}
            }
        ]} })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some internal error occured while retrieving reservations."
            });
        });
};

// Find a single Reservation by id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Reservation.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some internal error occured while retrieving Reservation with id=" + id
            });
        });
};

// Update a Reservation by id
exports.update = (req, res) => {
    const id = req.params.id;

    Reservation.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Reservation was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Reservation with id=${id}. Maybe the Reservation was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Reservation with id=" + id
            });
        });
};

// Delete a Reservation by id
exports.delete = (req, res) => {
    const id = req.params.id;

    Reservation.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Reservation was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Reservation with id=${id}. Maybe Reservation was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: 
                    err.message || "Could not delete Reservation with id=" + id
            });
        });
};
