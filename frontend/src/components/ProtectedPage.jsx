import React from 'react';

function ProtectedPage() {
  // Récupère le token depuis le localStorage
  const token = localStorage.getItem('token');

  // Si le token n'est pas présent, redirige l'utilisateur vers la page de connexion
  if (!token) {
    window.location.href = '/login'; // Redirection en JavaScript (simple mais moins élégante)
    return null; // Ne rien afficher si on est redirigé
  }

  return (
    <div>
      <h1>Page Protégée</h1>
      <p>Bienvenue sur la page protégée !</p>
      {/* Tu peux ajouter d'autres informations ici, comme le nom d'utilisateur */}
    </div>
  );
}

export default ProtectedPage;