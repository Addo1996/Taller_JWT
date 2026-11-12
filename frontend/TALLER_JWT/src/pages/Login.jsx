
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/apiConfig';

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const { login } = useAuth();

    const manejarSubmit = async (e) => {

        e.preventDefault();

        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Error al iniciar sesión');
            }

            const datos = await response.json();
            login(datos.token);
            navigate('/perfil');

        } catch (error) {
            setError(error.message);
        }

    };

    return (
        <div className="auth-page">

            {/* Panel visual izquierdo */}
            <section className="auth-visual">
                <div className="visual-content">
                    <span className="visual-logo">JWT</span>

                    <h1>Bienvenido de nuevo</h1>

                    <p>
                        Accede a tu cuenta y continúa disfrutando
                        de nuestro sistema seguro de autenticación.
                    </p>

                    <div className="visual-decoration">
                        <div className="decoration-circle"></div>
                        <div className="decoration-card">
                            <span>🔐</span>
                            <h3>Acceso seguro</h3>
                            <p>Protección mediante JWT</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Panel del formulario */}
            <section className="auth-content">

                <div className="auth-card">

                    <span className="form-subtitle">Bienvenido</span>

                    <h2>Inicio de sesión</h2>

                    <p className="form-description">
                        Ingresa tus datos para acceder a tu cuenta.
                    </p>

                    <form onSubmit={manejarSubmit}>

                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                placeholder="Ingresa tu contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="auth-button">
                            Iniciar sesión
                        </button>

                    </form>

                    <div className="form-footer">
                        <p>¿No tienes una cuenta?</p>
                        <Link to="/registrar">Crear una cuenta</Link>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Login;
