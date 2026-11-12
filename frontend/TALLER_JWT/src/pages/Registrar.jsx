
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <div>
            <h2>Registro de usuarios</h2>

            <form onSubmit={manejarSubmit}>
                <div>
                    <label>Usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Rol:</label>
                    <select
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                    >
                        <option value="USER">Usuario</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                </div>

                {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit">
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default Registrar;
