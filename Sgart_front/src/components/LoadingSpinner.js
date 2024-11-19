import React from 'react';
import '../App.css';

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando...</p>
        </div>
    );
};

export default LoadingSpinner;
