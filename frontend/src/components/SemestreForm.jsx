import React, { useState } from 'react';
import { createSemestre } from './api';
import './SemestreForm.css';

function SemestreForm({ filiereId }) {
    const [nom, setNom] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createSemestre({ nom, filiereId });
            // Rafraîchir la liste des semestres (à implémenter)
            setNom('');
        } catch (error) {
            console.error('Erreur lors de la création du semestre:', error.message);
        }
    };

    return (
        <div>
            <h2>Créer un semestre</h2>
            <form onSubmit={handleSubmit}>
                <label>Nom:</label>
                <input type="text" value={nom} onChange={e => setNom(e.target.value)} required />
                <button type="submit">Créer</button>
            </form>
        </div>
    );
}

export default SemestreForm;