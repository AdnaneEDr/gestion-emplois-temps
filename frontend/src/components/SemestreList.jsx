import React, { useState, useEffect } from 'react';
import { getSemestres } from './api';
import './SemestreList.css';

function SemestreList({ filiereId }) {
    const [semestres, setSemestres] = useState([]);

    useEffect(() => {
        const loadSemestres = async () => {
            try {
                const data = await getSemestres(filiereId);
                setSemestres(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des semestres:', error.message);
            }
        };
        loadSemestres();
    }, [filiereId]);

    return (
        <div>
            <h2>Liste des semestres</h2>
            <ul>
                {semestres.map(semestre => (
                    <li key={semestre.id}>{semestre.nom}</li>
                ))}
            </ul>
        </div>
    );
}

export default SemestreList;