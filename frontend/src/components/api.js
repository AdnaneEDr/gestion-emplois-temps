const API_BASE_URL = 'http://localhost:3001/api';

// Ajoute le token aux requêtes
const request = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}) // Ajoute le token si présent
    };

    console.log("Requête vers :", url);
    console.log("Options de la requête :", options);

    const response = await fetch(url, {
        headers,
        ...options
    });

    if (!response.ok) {
        const message = `Erreur: ${response.status}`;
        throw new Error(message);
    }
    return await response.json();
};

// Filières
export const getFilieres = () => request(`${API_BASE_URL}/filieres`);
export const createFiliere = (data) => request(`${API_BASE_URL}/filieres`, { method: 'POST', body: JSON.stringify(data) });
export const updateFiliere = (id, data) => request(`${API_BASE_URL}/filieres/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteFiliere = (id) => request(`${API_BASE_URL}/filieres/${id}`, { method: 'DELETE' });

// Semestres
export const getSemestres = (filiereId) => request(`${API_BASE_URL}/semestres/${filiereId}`);
export const createSemestre = (data) => request(`${API_BASE_URL}/semestres`, { method: 'POST', body: JSON.stringify(data) });
export const updateSemestre = (id, data) => request(`${API_BASE_URL}/semestres/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSemestre = (id) => request(`${API_BASE_URL}/semestres/${id}`, { method: 'DELETE' });

// Matières
export const getMatieres = () => request(`${API_BASE_URL}/matieres`);
export const createMatiere = (data) => request(`${API_BASE_URL}/matieres`, { method: 'POST', body: JSON.stringify(data) });
export const updateMatiere = (id, data) => request(`${API_BASE_URL}/matieres/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMatiere = (id) => request(`${API_BASE_URL}/matieres/${id}`, { method: 'DELETE' });

// Emplois du temps
export const getEmploisDuTemps = () => request(`${API_BASE_URL}/emplois-du-temps`);
export const createEmploiDuTemps = (data) => request(`${API_BASE_URL}/emplois-du-temps`, { method: 'POST', body: JSON.stringify(data) });
export const updateEmploiDuTemps = (id, data) => request(`${API_BASE_URL}/emplois-du-temps/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteEmploisDuTemps = (id) => request(`${API_BASE_URL}/emplois-du-temps/${id}`, { method: 'DELETE' });