import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterForm.css';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // Rediriger vers la page de connexion après une inscription réussie
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Erreur lors de l\'inscription.');
    }
  };

  return (
    <div className="register-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      <div className="login-link">
        <p>Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
      </div>
    </div>
  );
}

export default RegisterForm;