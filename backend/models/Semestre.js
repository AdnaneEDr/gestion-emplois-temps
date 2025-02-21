module.exports = (sequelize, DataTypes) => {
    const Semestre = sequelize.define('Semestre', {
        nom: {
            type: DataTypes.STRING,
            allowNull: false
        },
        filiereId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'semestres', // Assurez-vous que c'est correct
        timestamps: false
    });

    Semestre.associate = (models) => {
        Semestre.belongsTo(models.Filiere, {
            foreignKey: 'filiereId',
            as: 'filiere',
        });
    };

    return Semestre;
};