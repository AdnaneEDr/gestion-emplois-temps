// Salle.js
module.exports = (sequelize, DataTypes) => {
    const Salle = sequelize.define('Salle', {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        capacite: {
            type: DataTypes.INTEGER,
        }
    }, {
        tableName: 'salles', // Le nom de votre table dans la base de données
        timestamps: false // Désactive les timestamps automatiques
    });

    return Salle;
};