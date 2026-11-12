
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

function Registrar() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('USER');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const manejarSubmit = async (e) => {

        e.preventDefault();

        setMensaje('');
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, rol })
            });

            if (!response.ok) {
                throw new Error('Error al registrar usuario');
            }

            setMensaje('¡Usuario registrado exitosamente!');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setError(error.message);
        }

    };

    return (
        <div className="auth-page">

            <section className="auth-visual">
                <div className="visual-content">

                    <span className="visual-logo">JWT</span>

                    <h1>Únete a nosotros</h1>

                    <p>
                        Crea tu cuenta y comienza a disfrutar
                        de nuestro sistema seguro de autenticación.
                    </p>

                    <div className="visual-decoration">
                        <div className="decoration-circle"></div>

                        <div className="decoration-card">
                            <span>👤</span>
                            <h3>Nuevo usuario</h3>
                            <p>Tu seguridad es nuestra prioridad</p>
                        </div>
                    </div>

                </div>
            </section>

            <section className="auth-content">
                <div className="auth-card">

                    <span className="form-subtitle">Crear cuenta</span>

                    <h2>Registro de usuarios</h2>

                    <p className="form-description">
                        Completa tus datos para registrarte.
                    </p>

                    <form onSubmit={manejarSubmit}>

                        <div className="form-group">
                            <label>Usuario</label>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ingresa tu usuario"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Ingresa tu contraseña"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Rol</label>

                            <select
                                value={rol}
                                onChange={(e) => setRol(e.target.value)}
                            >
                                <option value="USER">Usuario</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>

                        {mensaje && (
                            <p style={{ color: 'green', marginTop: '12px' }}>
                                {mensaje}
                            </p>
                        )}

                        {error && (
                            <p className="error-message">{error}</p>
                        )}

                        <button type="submit" className="auth-button">
                            Registrarse
                        </button>

                    </form>

                    <div className="form-footer">
                        <p>¿Ya tienes una cuenta?</p>
                        <Link to="/login">Iniciar sesión</Link>
                    </div>

                </div>
            </section>

        </div>
    );
}

export default Registrar;
