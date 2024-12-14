import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = sessionStorage.getItem('authToken');

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    // Decodificar el token y obtener el rol
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;

    // Verificar si el rol del usuario está en los roles permitidos
    if (allowedRoles.includes(userRole)) {
      return children; // Renderiza la ruta protegida
    } else {
      return <Navigate to="/" />; // Redirigir si no tiene acceso
    }
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return <Navigate to="/" />; // Redirigir si el token es inválido
  }
};

export default ProtectedRoute;
