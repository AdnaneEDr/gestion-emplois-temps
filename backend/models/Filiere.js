module.exports = (sequelize, DataTypes) => {
    const Filiere = sequelize.define('Filiere', {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'filieres',
        timestamps: false // Important: Désactive les timestamps automatiques
    });

    Filiere.associate = (models) => {
        Filiere.hasMany(models.Semestre, {
            foreignKey: 'filiereId',
            as: 'semestres'
        });
    };

    return Filiere;
};