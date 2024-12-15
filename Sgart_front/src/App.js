import React from 'react';
import { Navigate, Route, HashRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import ActualizarPwdForm from './components/ActualizarPwdForm';
import AdminAusenciasUI from './components/AdminAusenciasUI';
import AdminGestionarHorariosDeTrabajo from './components/AdminGestionarHorariosDeTrabajo';
import AdminPanel from './components/AdminPanel';
import AdminVisualizarCalendario from './components/AdminVisualizarCalendario';
import GoogleAuth from './components/GoogleAuth';
import GoogleAuthLogin from './components/GoogleAuthLogin';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import RecuperarPwdForm from './components/RecuperarPwdForm';
import RegisterForm from './components/RegisterForm';
import UserCalendarUI from './components/UserCalendarUI';
import UserEdit from './components/UserEdit';
import UserOptions from './components/UserOptions'; // Importa el componente UserOptions
import UserValidationUI from './components/UserValidationUI'; // Importa el componente UserValidationUI

const App = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Ruta pública para cambiar contraseña */}
          <Route path="reset-password" element={<ActualizarPwdForm />} />

          {/* Rutas públicas */}
          <Route path="/" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          <Route path="recover-password" element={<RecuperarPwdForm />} />
          <Route path="/google-auth" element={<GoogleAuth />} />
          <Route path="/google-auth-login" element={<GoogleAuthLogin />} />

          {/* Rutas protegidas para administradores */}
          <Route
            path="/admin-working-hours"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminGestionarHorariosDeTrabajo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-calendar-view"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminVisualizarCalendario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-ausencias"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAusenciasUI />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas para empleados */}
          <Route
            path="/user-calendar"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <UserCalendarUI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <UserEdit />
              </ProtectedRoute>
            }
          />

          {/* Nuevas rutas */}
          <Route
            path="/user-options"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserOptions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-panel"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-ausencias"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAusenciasUI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-validation"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserValidationUI />
              </ProtectedRoute>
            }
          />

          {/* Redirigir a login si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
