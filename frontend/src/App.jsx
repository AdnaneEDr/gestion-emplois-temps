import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FiliereList from './components/FiliereList';
import FiliereForm from './components/FiliereForm';
import SemestreList from './components/SemestreList';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ProtectedPage from './components/ProtectedPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ajout de la redirection pour la route racine */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/protected" element={
          localStorage.getItem("token") ? (
            <ProtectedPage />
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/filieres" element={<FiliereList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;