
// Importamos los hooks necesarios de React
import { useState, useEffect } from 'react';

// Importamos useNavigate para navegar entre páginas
import { useNavigate } from 'react-router-dom';

// Importamos el contexto de autenticación
import { useAuth } from '../context/AuthContext';

// Importamos la URL base de nuestra API
import { API_BASE_URL } from '../config/apiConfig';

function Perfil(){

    // Estado para almacenar los datos del perfil del usuario
    const [datosPerfil, setDatosPerfil] = useState('');

    // Estado para almacenar posibles mensajes de error
    const [error, setError] = useState('');

    // Obtenemos el token JWT del contexto de autenticación
    const { token, logout } = useAuth();

    // Permite realizar redirecciones entre páginas
    const navigate = useNavigate();

    // useEffect ejecuta la carga del perfil cuando cambia el token
    useEffect(() => {

        // Función asíncrona para consultar los datos del perfil
        const cargarPerfil = async () => {
            
            try {
                // Realizamos una petición GET al endpoint del perfil
                const response = await fetch(`${API_BASE_URL}/auth/perfil`, {
                    headers: {
                        // Enviamos el token JWT para identificar al usuario
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Verificamos si la respuesta del servidor fue correcta
                if (!response.ok) {
                    throw new Error('No se pudo cargar el perfil, iniciar nuevamente sesion');
                }

                // Convertimos la respuesta del servidor a formato JSON
                const datos = await response.json();

                // Guardamos los datos recibidos en el estado
                setDatosPerfil(datos);

            }catch (error){

                // Guardamos el mensaje de error para mostrarlo en pantalla
                setError(error.message);
            }

            };

            // Ejecutamos la función para cargar el perfil
            cargarPerfil();

        },[token]);

        // Función para cerrar la sesión del usuario
        const manejarLogout = async () => {
            try{

                // Enviamos una petición POST para revocar el token JWT
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        // Enviamos el token que queremos revocar
                        'Authorization': `Bearer ${token}`
                    }
                });
                

            }catch (error){

                // Mostramos un mensaje si ocurre un problema de conexión
                console.log('Error de red al intetar revocar el token: ', error);

            }

            // Cerramos la sesión localmente
            logout();

            // Redirigimos al usuario a la página de inicio de sesión
            navigate('/login');
        };

        return (
            <div>
                <div>
                    <h2>Perfil de Usuario</h2>

                    {/* Botón que ejecuta el cierre de sesión */}
                    <button onClick={manejarLogout}>
                        Cerrar Sesion
                    </button>
                </div>

                {/* Mostramos el mensaje de error si existe */}
                {error && <p>{error}</p>}

                {/* Mostramos los datos del perfil cuando están disponibles */}
                {datosPerfil && (
                      <div>
                    <p>{datosPerfil.Mensaje}</p>
                    <p>{datosPerfil.Usuario}</p>
                    <p>{datosPerfil.rol_Detectado}</p>
                    <p>{datosPerfil.Status}</p>
                </div>
                )}
            </div>
        )
    }

    // Exportamos el componente para utilizarlo en otras partes del proyecto
    export default Perfil;
