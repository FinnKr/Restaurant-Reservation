module.exports = (sequelize, Sequelize) => {
    const Table = sequelize.define("table", {
        chairs: {
            type: Sequelize.INTEGER
        }
    });

    return Table;
};