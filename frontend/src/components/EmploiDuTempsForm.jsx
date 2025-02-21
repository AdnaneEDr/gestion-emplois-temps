import React, { useState } from 'react';
import { createEmploiDuTemps } from './api';
import './EmploiDuTempsForm.css';

function EmploiDuTempsForm() {
    const [jour, setJour] = useState('');
    const [heure_debut, setHeureDebut] = useState('');
    const [heure_fin, setHeureFin] = useState('');
    const [matiereId, setMatiereId] = useState('');
    const [enseignantId, setEnseignantId] = useState('');
    const [salleId, setSalleId] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createEmploiDuTemps({ jour, heure_debut, heure_fin, matiereId, enseignantId, salleId });
            // Rafraîchir la liste des emplois du temps (à implémenter)
            setJour('');
            setHeureDebut('');
            setHeureFin('');
            setMatiereId('');
            setEnseignantId('');
            setSalleId('');
        } catch (error) {
            console.error('Erreur lors de la création de l\'emploi du temps:', error.message);
        }
    };

    return (
        <div>
            <h2>Créer un emploi du temps</h2>
            <form onSubmit={handleSubmit}>
                <label>Jour:</label>
                <input type="text" value={jour} onChange={e => setJour(e.target.value)} required />
                <label>Heure de début:</label>
                <input type="time" value={heure_debut} onChange={e => setHeureDebut(e.target.value)} required />
                <label>Heure de fin:</label>
                <input type="time" value={heure_fin} onChange={e => setHeureFin(e.target.value)} required />
                <label>Matière ID:</label>
                <input type="number" value={matiereId} onChange={e => setMatiereId(e.target.value)} required />
                <label>Enseignant ID:</label>
                <input type="number" value={enseignantId} onChange={e => setEnseignantId(e.target.value)} required />
                <label>Salle ID:</label>
                <input type="number" value={salleId} onChange={e => setSalleId(e.target.value)} required />
                <button type="submit">Créer</button>
            </form>
        </div>
    );
}

export default EmploiDuTempsForm;