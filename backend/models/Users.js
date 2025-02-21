// Users.js
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'users', // Le nom de votre table dans la base de données
        timestamps: false // Désactive les timestamps automatiques
    });

    return Users;
};