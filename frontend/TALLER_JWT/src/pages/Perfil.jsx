
// Importamos los hooks necesarios de React
import { useState, useEffect } from 'react';

// Importamos useNavigate para navegar entre páginas
import { useNavigate } from 'react-router-dom';

// Importamos el contexto de autenticación
import { useAuth } from '../context/AuthContext';

// Importamos la URL base de nuestra API
import { API_BASE_URL } from '../config/apiConfig';

function Perfil() {

    // Estados para almacenar los datos del perfil y los mensajes
    const [datosPerfil, setDatosPerfil] = useState('');
    const [error, setError] = useState('');

    // Obtenemos el token JWT y la función para cerrar sesión
    const { token, logout } = useAuth();

    // Permite realizar redirecciones entre páginas
    const navigate = useNavigate();

    // Consultamos el perfil cuando cambia el token
    useEffect(() => {

        const cargarPerfil = async () => {

            try {
                const response = await fetch(`${API_BASE_URL}/auth/perfil`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar el perfil, inicia nuevamente sesión');
                }

                const datos = await response.json();
                setDatosPerfil(datos);

            } catch (error) {
                setError(error.message);
            }
        };

        cargarPerfil();

    }, [token]);

    // Función para cerrar la sesión
    const manejarLogout = async () => {

        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

        } catch (error) {
            console.log('Error de red al intentar revocar el token:', error);
        }

        logout();
        navigate('/login');
    };

    return (
        <div className="perfil-page">

            {/* Encabezado principal */}
            <header className="perfil-header">
                <div className="perfil-logo">
                    JWT<span>.</span>
                </div>

                <button className="logout-button" onClick={manejarLogout}>
                    Cerrar sesión
                </button>
            </header>

            {/* Contenido del perfil */}
            <main className="perfil-main">

                <section className="perfil-welcome">
                    <span className="perfil-subtitle">PANEL DE USUARIO</span>
                    <h1>¡Bienvenido!</h1>
                    <p>Tu sesión se encuentra activa y protegida mediante autenticación JWT.</p>
                </section>
                {/* Accesos a las funcionalidades del sistema */}
                <section className="perfil-opciones">

                    <button onClick={() => navigate('/videojuegos')}>
                        Ver catálogo de videojuegos
                    </button>

                    <button onClick={() => navigate('/gestion')}>
                        Gestionar videojuegos
                    </button>

                </section>

                {/* Mensaje de error */}
                {error && (
                    <div className="perfil-error">
                        {error}
                    </div>
                )}

                {/* Información recibida del backend */}
                {datosPerfil && (
                    <section className="perfil-card">

                        <div className="perfil-card-header">
                            <div className="perfil-avatar">
                                {datosPerfil.Usuario?.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <h2>{datosPerfil.Usuario}</h2>
                                <p>Cuenta de usuario</p>
                            </div>

                            <span className="perfil-badge">
                                Activo
                            </span>
                        </div>

                        <div className="perfil-divider"></div>

                        <h3>Información de la cuenta</h3>

                        <div className="perfil-info-grid">

                            <div className="perfil-info-item">
                                <span>Usuario</span>
                                <strong>{datosPerfil.Usuario}</strong>
                            </div>

                            <div className="perfil-info-item">
                                <span>Rol asignado</span>
                                <strong>{datosPerfil.rol_Detectado}</strong>
                            </div>

                            <div className="perfil-info-item">
                                <span>Estado de sesión</span>
                                <strong className="perfil-status">
                                    {datosPerfil.Status}
                                </strong>
                            </div>

                        </div>

                        <div className="perfil-security">
                            <span>🔐</span>
                            <div>
                                <strong>Autenticación segura</strong>
                                <p>{datosPerfil.Mensaje}</p>
                            </div>
                        </div>

                    </section>
                )}

            </main>

            <footer className="perfil-footer">
                Sistema de autenticación JWT · React & Spring Boot
            </footer>

        </div>
    );
}

// Exportamos el componente
export default Perfil;
