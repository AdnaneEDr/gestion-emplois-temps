module.exports = (sequelize, DataTypes) => {
    const Matiere = sequelize.define('Matiere', {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT
        },
        nb_heures: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },
        filiereId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        semestreId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'matieres',
        timestamps: false
    });

    Matiere.associate = (models) => {
        Matiere.belongsTo(models.Filiere, {
            foreignKey: 'filiereId',
            as: 'filiere'
        });
        Matiere.belongsTo(models.Semestre, {
            foreignKey: 'semestreId',
            as: 'semestre'
        });
    };

    return Matiere;
};