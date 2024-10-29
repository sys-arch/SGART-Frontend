import React, {useState} from "react";
import LoginForm from "./LoginForm";

const RecuperarPwdForm = () => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isOut, setIsOut] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'email') {
            setEmail(value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('El formato del correo electrónico no es válido.');
            return;
        }

        alert('Solicitud de restablecimiento de contraseña enviada.');
        setError('');
        // Enviar los datos al backend...
    };

    const handleToggleForm = () => {
        setIsOut(true);
    };

    if (isOut) {
        return <LoginForm />;
    }

    return (
        <div className="login-container">
        <div className="login-box">
            <form action="#" method="post" onSubmit={handleSubmit}>
                <h2>Restablecer Contraseña</h2>
                <p style={{ marginTop: "5px", marginBottom: "30px", fontSize: "12px", color: "#555"}}>
                Introduzca su dirección de correo electrónico y le enviaremos un enlace para restablecer su contraseña.
                </p>
                    <div className="input-group">
                        <input type="email" id="email" name="email" value={email} onChange={handleChange} required/>
                        <label htmlFor="email">Usuario</label>
                    </div>
                    <button type="submit" className="login-btn">Solicitar Restablecer mi Contraseña</button>
                    <div className="login-options" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <a href="#" onClick={handleToggleForm}>Volver al formulario de Login</a>
                    </div>
            </form>
        </div>
        </div>
    );
};

export default RecuperarPwdForm;