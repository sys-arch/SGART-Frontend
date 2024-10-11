import React from 'react';

const VentanaConfirm = ({ onConfirm, onCancel, action }) => {
    return (
        <div className="ventana-confirm">
            <div className="confirmation-content">
                <h3>{action === 'save' ? 'Confirmar Cambios' : 'Confirmar Eliminación'}</h3>
                <p>{action === 'save' ? '¿Está seguro de que desea guardar los cambios?' : '¿Está seguro de que desea eliminar este usuario?'}</p>
                <div className="confirmation-buttons">
                    <button className="confirm-btn" onClick={onConfirm}>Confirmar</button>
                    <button className="cancel-btn" onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default VentanaConfirm;
