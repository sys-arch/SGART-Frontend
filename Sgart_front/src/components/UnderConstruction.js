// src/components/UnderConstruction.js
import React from 'react';
import miningGif from '../media/mine-mining.gif';

const UnderConstruction = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ color: 'white' }}>En construcción</h1>
      <p style={{ color: 'white' }}>Estamos trabajando en esta funcionalidad. ¡Vuelve pronto!</p>
      <div style={{ marginTop: '20px' }}>
        <img src={miningGif} alt="Minería" style={{ width: '50%' }} />
      </div>
    </div>
  );
};

export default UnderConstruction;
