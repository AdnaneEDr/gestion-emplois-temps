import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginForm.css';  // Importez le CSS

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Stocke le token dans le localStorage
                localStorage.setItem('token', data.token);

                // Redirige l'utilisateur vers une page protégée (à créer)
                navigate('/protected');

                alert(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            alert('Erreur lors de la connexion.');
        }
    };

    return (
        <div className="login-container">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Nom d'utilisateur:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>
            <div className="register-link">
                <p>Pas encore de compte ? <Link to="/register">S'inscrire</Link></p>
            </div>
        </div>
    );
}

export default LoginForm;