import React, { useState, useEffect } from 'react';
import { getMatieres } from './api';
import './MatiereList.css';
function MatiereList() {
    const [matieres, setMatieres] = useState([]);

    useEffect(() => {
        const loadMatieres = async () => {
            try {
                const data = await getMatieres();
                setMatieres(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des matières:', error.message);
            }
        };
        loadMatieres();
    }, []);

    return (
        <div>
            <h2>Liste des matières</h2>
            <ul>
                {matieres.map(matiere => (
                    <li key={matiere.id}>{matiere.nom}</li>
                ))}
            </ul>
        </div>
    );
}

export default MatiereList;