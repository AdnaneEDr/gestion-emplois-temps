import React, { useState } from 'react';
import { createMatiere } from './api';
import './MatiereForm.css';
function MatiereForm() {
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [nb_heures, setNbHeures] = useState('');
    const [filiereId, setFiliereId] = useState('');
    const [semestreId, setSemestreId] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createMatiere({ nom, description, nb_heures, filiereId, semestreId });
            // Rafraîchir la liste des matières (à implémenter)
            setNom('');
            setDescription('');
            setNbHeures('');
            setFiliereId('');
            setSemestreId('');
        } catch (error) {
            console.error('Erreur lors de la création de la matière:', error.message);
        }
    };

    return (
        <div>
            <h2>Créer une matière</h2>
            <form onSubmit={handleSubmit}>
                <label>Nom:</label>
                <input type="text" value={nom} onChange={e => setNom(e.target.value)} required />
                <label>Description:</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} />
                <label>Nombre d'heures:</label>
                <input type="number" value={nb_heures} onChange={e => setNbHeures(e.target.value)} required />
                <label>Filière ID:</label>
                <input type="number" value={filiereId} onChange={e => setFiliereId(e.target.value)} required />
                <label>Semestre ID:</label>
                <input type="number" value={semestreId} onChange={e => setSemestreId(e.target.value)} required />
                <button type="submit">Créer</button>
            </form>
        </div>
    );
}

export default MatiereForm;