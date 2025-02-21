const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
const port = 3001;

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'], // Ajout de PUT et DELETE pour les requêtes futures
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Configuration de la base de données
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false // Désactive les logs SQL en production
    }
);

// Définition des Models (Important : après la config de sequelize)
const FiliereModel = require('./models/Filiere');
const SemestreModel = require('./models/Semestre');
const MatiereModel = require('./models/Matiere');
const EmploiDuTempsModel = require('./models/EmploiDuTemps');
const UsersModel = require('./models/Users'); // Assurez-vous que le chemin est correct
const SalleModel = require('./models/Salle');

const Filiere = FiliereModel(sequelize, DataTypes);
const Semestre = SemestreModel(sequelize, DataTypes);
const Matiere = MatiereModel(sequelize, DataTypes);
const EmploiDuTemps = EmploiDuTempsModel(sequelize, DataTypes);
const Users = UsersModel(sequelize, DataTypes);
const Salle = SalleModel(sequelize, DataTypes);

// Associations (Important : après la définition des models)
Filiere.associate = (models) => {
    Filiere.hasMany(Semestre, {
        foreignKey: 'filiereId',
        as: 'semestres'
    });
};

Semestre.associate = (models) => {
    Semestre.belongsTo(Filiere, {
        foreignKey: 'filiereId',
        as: 'filiere',
    });
};

Matiere.associate = (models) => {
    Matiere.belongsTo(Filiere, {
        foreignKey: 'filiereId',
        as: 'filiere'
    });
    Matiere.belongsTo(Semestre, {
        foreignKey: 'semestreId',
        as: 'semestre'
    });
};
EmploiDuTemps.associate = (models) => {
    EmploiDuTemps.belongsTo(Matiere, {
        foreignKey: 'matiereId',
        as: 'matiere'
    });
     // Mettre Enseignant au lieu de Users si c'est un role , mettre un alias aussi comme Enseignant: Users
    EmploiDuTemps.belongsTo(Users, { 
        foreignKey: 'enseignantId',
        as: 'enseignant'
    });
    EmploiDuTemps.belongsTo(Salle, {
        foreignKey: 'salleId',
        as: 'salle'
    });
};
   

// Synchronisation de la base de données (Important : après les associations)
/*(async () => {
    try {
        await sequelize.sync({ alter: true }); // force: true pour recréer les tables
        console.log('Base de données synchronisée.');
    } catch (error) {
        console.error('Erreur lors de la synchronisation de la base de données:', error);
    }
})();*/

// Middleware pour vérifier le JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Pas de token fourni.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide.' });
        }

        req.user = user;
        next();
    });
};

// Les routes API (Endpoints)
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Hash le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crée l'utilisateur dans la base de données
        const newUser = await Users.create({
            username: username,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Utilisateur enregistré avec succès!' });
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Recherche l'utilisateur dans la base de données
        const user = await Users.findOne({ where: { username: username } });

        if (!user) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        // Vérifie le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Identifiants invalides' });
        }

        // Crée et assigne un token
        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);

        res.json({ message: 'Connecté!', token: token });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
});

// Route protégée
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: `Bonjour, ${req.user.username}! C'est une route protégée.` });
});

// API pour récupérer toutes les filières
app.get('/api/filieres', authenticateToken, async (req, res) => {
    try {
        const filieres = await Filiere.findAll();
        res.json(filieres);
    } catch (error) {
        console.error('Erreur lors de la récupération des filières:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des filières' });
    }
});

// API pour créer une nouvelle filière
app.post('/api/filieres', authenticateToken, async (req, res) => {
    try {
        const { nom, description } = req.body;
        const nouvelleFiliere = await Filiere.create({ nom, description });
        res.status(201).json({ message: 'Filière créée avec succès', filiere: nouvelleFiliere });
    } catch (error) {
        console.error('Erreur lors de la création de la filière:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la filière' });
    }
});
// API pour récupérer tous les semestres
// API pour récupérer tous les semestres d'une filière
app.get('/api/semestres/:filiereId', authenticateToken, async (req, res) => {
    try {
        const { filiereId } = req.params;
        const semestres = await Semestre.findAll({
            where: {
                filiereId: filiereId
            }
        });
        res.json(semestres);
    } catch (error) {
        console.error('Erreur lors de la récupération des semestres:', error.message);
        console.error('Erreur complète:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des semestres' });
    }
});
// API pour créer un nouveau semestre
app.post('/api/semestres', authenticateToken, async (req, res) => {
    try {
        const { nom, filiereId } = req.body;

        // Validation de base
        if (!nom || !filiereId) {
            return res.status(400).json({ message: 'Le nom et l\'ID de la filière sont requis.' });
        }

        // Vérifier si la filière existe
        const filiere = await Filiere.findByPk(filiereId);
        if (!filiere) {
            return res.status(400).json({ message: 'La filière spécifiée n\'existe pas.' });
        }

        const nouveauSemestre = await Semestre.create({ nom, filiereId });
        res.status(201).json({ message: 'Semestre créé avec succès', semestre: nouveauSemestre });
    } catch (error) {
        console.error('Erreur lors de la création du semestre:', error);
        res.status(500).json({ message: 'Erreur lors de la création du semestre' });
    }
});

// API pour récupérer toutes les matières
app.get('/api/matieres', authenticateToken, async (req, res) => {
    try {
        const matieres = await Matiere.findAll();
        res.json(matieres);
    } catch (error) {
        console.error('Erreur lors de la récupération des matières:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des matières' });
    }
});

// API pour créer une nouvelle matière
app.post('/api/matieres', authenticateToken, async (req, res) => {
    try {
        const { nom, description, nb_heures, filiereId, semestreId } = req.body;

        // Validation de base
        if (!nom || !nb_heures || !filiereId || !semestreId) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être fournis.' });
        }

        // Vérification si la filière et le semestre existent
        const filiere = await Filiere.findByPk(filiereId);
        const semestre = await Semestre.findByPk(semestreId);

        if (!filiere || !semestre) {
            return res.status(400).json({ message: 'Filière ou semestre invalide.' });
        }

        const matiere = await Matiere.create({ nom, description, nb_heures, filiereId, semestreId });
        res.status(201).json({ message: 'Matière créée avec succès', matiere: matiere });
    } catch (error) {
        console.error('Erreur lors de la création de la matière:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la matière' });
    }
});
// API pour récupérer une matière
app.get('/api/matieres/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const matiere = await Matiere.findByPk(id);

        if (!matiere) {
            return res.status(404).json({ message: 'Matière non trouvée.' });
        }

        res.json(matiere);
    } catch (error) {
        console.error('Erreur lors de la récupération de la matière:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la matière' });
    }
});
// API pour modifier une matière
app.put('/api/matieres/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description, nb_heures, filiereId, semestreId } = req.body;

        // Vérification si la matière existe
        const matiere = await Matiere.findByPk(id);
        if (!matiere) {
            return res.status(404).json({ message: 'Matière non trouvée.' });
        }

        // Mise à jour de la matière
        await Matiere.update({ nom, description, nb_heures, filiereId, semestreId }, {
            where: {
                id: id
            }
        });

        // Récupération de la matière mise à jour
        const matiereMiseAJour = await Matiere.findByPk(id);

        res.json({ message: 'Matière mise à jour avec succès', matiere: matiereMiseAJour });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la matière:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la matière' });
    }
});

// API pour supprimer une matière
app.delete('/api/matieres/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Vérification si la matière existe
        const matiere = await Matiere.findByPk(id);
        if (!matiere) {
            return res.status(404).json({ message: 'Matière non trouvée.' });
        }

        // Suppression de la matière
        await Matiere.destroy({
            where: {
                id: id
            }
        });

        res.json({ message: 'Matière supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la matière:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de la matière' });
    }
});


// API pour créer un nouvel emploi du temps
app.post('/api/emplois-du-temps', authenticateToken, async (req, res) => {
    try {
        const { jour, heure_debut, heure_fin, matiereId, enseignantId, salleId } = req.body;

        // Validation des données (vous pouvez ajouter plus de validation)
        if (!jour || !heure_debut || !heure_fin || !matiereId || !enseignantId || !salleId) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
        }

        // Vérification des conflits (vous devrez adapter cette logique)
        // const conflits = await EmploiDuTemps.verifierConflits({ jour, heure_debut, heure_fin, matiereId, enseignantId, salleId });
        // if (conflits && conflits.length > 0) {
        //     return res.status(409).json({ message: 'Ce créneau est déjà pris', conflits });
        // }

        //Assurez vous que c'est userId et pas enseignantId dans EmploiDuTemps
        const cours = await EmploiDuTemps.create({
            jour,
            heure_debut,
            heure_fin,
            matiereId,
            enseignantId,
            salleId
        });
        res.status(201).json({ message: 'Emploi du temps créé avec succès', cours: cours });
    } catch (error) {
        console.error('Erreur lors de la création de l\'emploi du temps:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ message: 'Erreur de validation des données', errors: error.errors });
        }
        res.status(500).json({ message: 'Erreur lors de la création de l\'emploi du temps' });
    }
});
app.post('/api/emplois-du-temps', authenticateToken, async (req, res) => {
    try {
        const { jour, heure_debut, heure_fin, matiereId, enseignantId, salleId } = req.body;

        // Validation de base
        if (!jour || !heure_debut || !heure_fin || !matiereId || !enseignantId || !salleId) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être fournis.' });
        }

        // Vérification si la matière, l'enseignant et la salle existent
        const matiere = await Matiere.findByPk(matiereId);
        const enseignant = await Users.findByPk(enseignantId);
        const salle = await Salle.findByPk(salleId);

        if (!matiere || !enseignant || !salle) {
            return res.status(400).json({ message: 'Matière, enseignant ou salle invalide.' });
        }

        const emploiDuTemps = await EmploiDuTemps.create({
            jour,
            heure_debut,
            heure_fin,
            matiereId,
            enseignantId,
            salleId
        });
        res.status(201).json({ message: 'Emploi du temps créé avec succès', emploiDuTemps: emploiDuTemps });
    } catch (error) {
        console.error('Erreur lors de la création de l\'emploi du temps:', error);
        res.status(500).json({ message: 'Erreur lors de la création de l\'emploi du temps' });
    }
});
app.get('/api/emplois-du-temps', authenticateToken, async (req, res) => {
    try {
        const emploisDuTemps = await EmploiDuTemps.findAll();
        res.json(emploisDuTemps);
    } catch (error) {
        console.error('Erreur lors de la récupération des emplois du temps:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des emplois du temps' });
    }
});
app.get('/api/emplois-du-temps/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const emploiDuTemps = await EmploiDuTemps.findByPk(id);

        if (!emploiDuTemps) {
            return res.status(404).json({ message: 'Emploi du temps non trouvé.' });
        }

        res.json(emploiDuTemps);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'emploi du temps:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'emploi du temps' });
    }
});
app.put('/api/emplois-du-temps/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { jour, heure_debut, heure_fin, matiereId, enseignantId, salleId } = req.body;

        // Vérification si l'emploi du temps existe
        const emploiDuTemps = await EmploiDuTemps.findByPk(id);
        if (!emploiDuTemps) {
            return res.status(404).json({ message: 'Emploi du temps non trouvé.' });
        }

        // Vérification si la matière, l'enseignant et la salle existent
        const matiere = await Matiere.findByPk(matiereId);
        const enseignant = await Users.findByPk(enseignantId);
        const salle = await Salle.findByPk(salleId);

        if (!matiere || !enseignant || !salle) {
            return res.status(400).json({ message: 'Matière, enseignant ou salle invalide.' });
        }

        // Mise à jour de l'emploi du temps
        await EmploiDuTemps.update({ jour, heure_debut, heure_fin, matiereId, enseignantId, salleId }, {
            where: {
                id: id
            }
        });

        // Récupération de l'emploi du temps mis à jour
        const emploiDuTempsMiseAJour = await EmploiDuTemps.findByPk(id);

        res.json({ message: 'Emploi du temps mis à jour avec succès', emploiDuTemps: emploiDuTempsMiseAJour });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'emploi du temps:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'emploi du temps' });
    }
});
app.delete('/api/emplois-du-temps/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Vérification si l'emploi du temps existe
        const emploiDuTemps = await EmploiDuTemps.findByPk(id);
        if (!emploiDuTemps) {
            return res.status(404).json({ message: 'Emploi du temps non trouvé.' });
        }

        // Suppression de l'emploi du temps
        await EmploiDuTemps.destroy({
            where: {
                id: id
            }
        });

        res.json({ message: 'Emploi du temps supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'emploi du temps:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'emploi du temps' });
    }
});
// Démarrage du serveur
app.listen(port, () => {
        console.log(`Serveur démarré sur le port ${port}`);
});