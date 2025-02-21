module.exports = (sequelize, DataTypes) => {
    const EmploiDuTemps = sequelize.define('EmploiDuTemps', {
        jour: {
            type: DataTypes.STRING,
            allowNull: false
        },
        heure_debut: {
            type: DataTypes.TIME,
            allowNull: false
        },
        heure_fin: {
            type: DataTypes.TIME,
            allowNull: false
        },
        matiereId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        enseignantId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        salleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'emplois_du_temps',
        timestamps: false
    });

    EmploiDuTemps.associate = (models) => {
        EmploiDuTemps.belongsTo(models.Matiere, {
            foreignKey: 'matiereId',
            as: 'matiere'
        });
        EmploiDuTemps.belongsTo(models.Users, {
            foreignKey: 'enseignantId',
            as: 'enseignant'
        });
        EmploiDuTemps.belongsTo(models.Salle, {
            foreignKey: 'salleId',
            as: 'salle'
        });
    };

    return EmploiDuTemps;
};