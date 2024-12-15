import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  console.log('ProtectedRoute se está ejecutando');

  const token = sessionStorage.getItem('authToken');
  console.log('token:', token);

  // Si no hay token, redirigir al login
  if (!token) {
    console.error('No hay token. Redirigiendo al login.');
    return <Navigate to="/" />;
  }
  try {
    const decodedToken = jwtDecode(token);
    console.log('Decoded Token:', decodedToken);
  
    const userRole = decodedToken.role;
    console.log('User Role:', userRole);
  
    if (allowedRoles.includes(userRole)) {
      return children; // Renderiza la ruta protegida
    } else {
      console.error('Rol no permitido:', userRole);
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
