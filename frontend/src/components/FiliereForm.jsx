import React, { useState } from 'react';
import { createFiliere } from './api';
import './FiliereForm.css';

function FiliereForm() {
    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await createFiliere({ nom, description });
            // Rafraîchir la liste des filières (à implémenter)
            setNom('');
            setDescription('');
        } catch (error) {
            console.error('Erreur lors de la création de la filière:', error.message);
        }
    };

    return (
        <div>
            <h2>Créer une filière</h2>
            <form onSubmit={handleSubmit}>
                <label>Nom:</label>
                <input type="text" value={nom} onChange={e => setNom(e.target.value)} required />
                <label>Description:</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} />
                <button type="submit">Créer</button>
            </form>
        </div>
    );
}

export default FiliereForm;