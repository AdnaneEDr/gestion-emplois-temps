import React, { useState, useEffect } from 'react';
import { getEmploisDuTemps } from './api';
import './EmploiDuTempsList.css';

function EmploiDuTempsList() {
    const [emploisDuTemps, setEmploisDuTemps] = useState([]);

    useEffect(() => {
        const loadEmploisDuTemps = async () => {
            try {
                const data = await getEmploisDuTemps();
                setEmploisDuTemps(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des emplois du temps:', error.message);
            }
        };
        loadEmploisDuTemps();
    }, []);

    return (
        <div>
            <h2>Liste des emplois du temps</h2>
            <ul>
                {emploisDuTemps.map(emploiDuTemps => (
                    <li key={emploiDuTemps.id}>{emploiDuTemps.jour} - {emploiDuTemps.heure_debut}</li>
                ))}
            </ul>
        </div>
    );
}

export default EmploiDuTempsList;