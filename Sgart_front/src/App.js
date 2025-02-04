import React from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import RecuperarPwdForm from './components/RecuperarPwdForm';
import GoogleAuth from './components/GoogleAuth';
import GoogleAuthLogin from './components/GoogleAuthLogin';
import AdminAusenciasUI from './components/AdminAusenciasUI';
import UserValidationUI from './components/UserValidationUI';
import AdminVisualizarCalendario from './components/AdminVisualizarCalendario';
import AdminGestionarHorariosDeTrabajo from './components/AdminGestionarHorariosDeTrabajo';
import UserOptions from './components/UserOptions';
import UnderConstruction from './components/UnderConstruction';
import './App.css';
import UserCalendarUI from './components/UserCalendarUI';
import UserEdit from './components/UserEdit';
import AdminPanel from './components/AdminPanel';
import ActualizarPwdForm from './components/ActualizarPwdForm';

const App = () => {
  return (
    <div className="App"> {/* Contenedor general con estilos */}
      <Router>
        <Routes>
          {/* La ruta debe coincidir exactamente con la URL generada por el backend */}
          <Route path="reset-password" element={<ActualizarPwdForm />} />
          
          {/* Rutas de autenticación */}
          <Route path="/" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="recover-password" element={<RecuperarPwdForm />} />
          
          {/* Rutas para Google Auth */}
          <Route path="/google-auth" element={<GoogleAuth />} />
          <Route path="/google-auth-login" element={<GoogleAuthLogin />} />

          {/* Ruta para el Dashboard del Administrador */}
          <Route path="/admin-working-hours" element={<AdminGestionarHorariosDeTrabajo />} />
          <Route path="/admin-calendar-view" element={<AdminVisualizarCalendario/>} />
          <Route path="/admin-management" element={<AdminPanel />} />

          {/* Ruta para el Usuario -> Calendario */}        
          <Route path="/user-calendar" element={<UserCalendarUI />} />

          {/* Ruta para el Usuario -> Visualizar Datos Perfil */}
          <Route path="/user-profile" element={<UserEdit />} />

          {/* Rutas para gestionar usuarios, administradores y ausencias */}
          <Route path="/user-options" element={<UserOptions />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/admin-ausencias" element={<AdminAusenciasUI />} />
          <Route path="/user-validation" element={<UserValidationUI />} />

          {/* Redirigir a login si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;