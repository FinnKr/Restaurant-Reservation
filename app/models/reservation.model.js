module.exports = (sequelize, Sequelize) => {
    const Reservation = sequelize.define("reservation", {
        starttime: {
            type: Sequelize.DATE
        },
        name: {
            type: Sequelize.STRING
        },
        mail: {
            type: Sequelize.STRING
        },
        tableid: {
            type: Sequelize.INTEGER
        }
    });

    return Reservation;
};