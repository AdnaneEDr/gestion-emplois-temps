import React, { useState, useEffect } from 'react';
import { getFilieres } from './api';
import './FiliereList.css'; // Importez le fichier CSS

function FiliereList() {
    const [filieres, setFilieres] = useState([]);

    useEffect(() => {
        const loadFilieres = async () => {
            try {
                console.log("Début de la récupération des filières...");
                const data = await getFilieres();
                console.log("Filières récupérées :", data);
                setFilieres(data);
                console.log("État des filières mis à jour :", filieres);
            } catch (error) {
                console.error('Erreur lors de la récupération des filières:', error);
            }
        };
        loadFilieres();
    }, []);

    return (
        <div>
            <h2>Liste des filières</h2>
            <ul>
                {filieres.map(filiere => (
                    <li key={filiere.id}>{filiere.nom}</li>
                ))}
            </ul>
        </div>
    );
}

export default FiliereList;