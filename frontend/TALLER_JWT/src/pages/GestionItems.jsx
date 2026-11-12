
import { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '../config/apiConfig'
import { useAuth } from '../context/AuthContext'
import './ListaItems.css'

function GestionItems() {

    const { token } = useAuth()

    // Estados del formulario
    const [nombre, setNombre] = useState('')
    const [plataforma, setPlataforma] = useState('')
    const [foto, setFoto] = useState(null)

    // Estados del sistema
    const [mensaje, setMensaje] = useState('')
    const [error, setError] = useState('')
    const [videojuegos, setVideojuegos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [idEditar, setIdEditar] = useState(null)

    // Referencia para controlar las imágenes Blob
    const imagenesAnteriores = useRef([])

    // Consultar los videojuegos registrados
    const listarVideojuegos = async () => {

        try {

            setError('')

            const respuesta = await fetch(`${API_BASE_URL}/auth/items`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!respuesta.ok) {
                throw new Error('Error al consultar los videojuegos')
            }

            const datos = await respuesta.json()

            // Convertir las imágenes Base64 en objetos Blob
            const lista = datos.map(videojuego => {

                const bytes = Uint8Array.from(
                    atob(videojuego.foto),
                    caracter => caracter.charCodeAt(0)
                )

                const imagen = new Blob(
                    [bytes],
                    { type: videojuego.mimeType }
                )

                const imagenUrl = URL.createObjectURL(imagen)

                return {
                    ...videojuego,
                    imagenUrl
                }
            })

            // Liberar las URL de las imágenes anteriores
            imagenesAnteriores.current.forEach(url => {
                URL.revokeObjectURL(url)
            })

            // Guardar las nuevas URL
            imagenesAnteriores.current = lista.map(
                videojuego => videojuego.imagenUrl
            )

            setVideojuegos(lista)

        } catch (error) {
            setError(error.message)
        } finally {
            setCargando(false)
        }
    }

    // Consultar al cargar la página
    useEffect(() => {

        listarVideojuegos()

        // Liberar las imágenes al salir del componente
        return () => {
            imagenesAnteriores.current.forEach(url => {
                URL.revokeObjectURL(url)
            })
        }

    }, [token])

    // Registrar o actualizar un videojuego
    const guardarVideojuego = async (e) => {

        e.preventDefault()

        setMensaje('')
        setError('')

        try {

            const formulario = new FormData()

            formulario.append('nombre', nombre)
            formulario.append('plataforma', plataforma)

            // Adjuntar la imagen solamente si se seleccionó
            if (foto) {
                formulario.append('foto', foto)
            }

            // Determinar si se registra o se actualiza
            const metodo = idEditar ? 'PUT' : 'POST'

            const url = idEditar
                ? `${API_BASE_URL}/auth/items/${idEditar}`
                : `${API_BASE_URL}/auth/items`

            const respuesta = await fetch(url, {
                method: metodo,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formulario
            })

            if (!respuesta.ok) {
                throw new Error('No se pudo guardar el videojuego')
            }

            // Limpiar los campos del formulario
            setNombre('')
            setPlataforma('')
            setFoto(null)
            setIdEditar(null)

            e.target.reset()

            setMensaje(
                metodo === 'POST'
                    ? 'Videojuego registrado correctamente'
                    : 'Videojuego actualizado correctamente'
            )

            // Actualizar el listado
            await listarVideojuegos()

        } catch (error) {
            setError(error.message)
        }
    }

    // Cargar los datos del videojuego seleccionado
    const editarVideojuego = (videojuego) => {

        setIdEditar(videojuego.id)
        setNombre(videojuego.nombre)
        setPlataforma(videojuego.plataforma)
        setFoto(null)

        setMensaje('')
        setError('')

        // Desplazarse hasta el formulario
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    // Cancelar la edición
    const cancelarEdicion = () => {

        setIdEditar(null)
        setNombre('')
        setPlataforma('')
        setFoto(null)

        setMensaje('')
        setError('')

        const formulario = document.getElementById('formulario-videojuego')

        if (formulario) {
            formulario.reset()
        }
    }

    // Eliminar un videojuego
    const eliminarVideojuego = async (id) => {

        const confirmar = window.confirm(
            '¿Estás seguro de eliminar este videojuego?'
        )

        if (!confirmar) {
            return
        }

        setMensaje('')
        setError('')

        try {

            const respuesta = await fetch(`${API_BASE_URL}/auth/items/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!respuesta.ok) {
                throw new Error('No se pudo eliminar el videojuego')
            }

            // Limpiar el formulario si se elimina el videojuego que se editaba
            if (idEditar === id) {
                cancelarEdicion()
            }

            setMensaje('Videojuego eliminado correctamente')

            // Actualizar el listado
            await listarVideojuegos()

        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className="gestion-items">

            <h1>Gestión de videojuegos</h1>

            {/* Formulario para registrar o editar */}
            <form
                id="formulario-videojuego"
                onSubmit={guardarVideojuego}
            >

                <h2>
                    {idEditar ? 'Editar videojuego' : 'Registrar videojuego'}
                </h2>

                <label>Nombre del videojuego</label>

                <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />

                <label>Plataforma</label>

                <input
                    type="text"
                    value={plataforma}
                    onChange={(e) => setPlataforma(e.target.value)}
                    required
                />

                <label>Imagen del videojuego</label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFoto(e.target.files[0] || null)}
                    required={!idEditar}
                />

                <button type="submit">
                    {idEditar ? 'Guardar cambios' : 'Registrar videojuego'}
                </button>

                {/* Mostrar cancelar solamente durante la edición */}
                {idEditar && (
                    <button type="button" onClick={cancelarEdicion}>
                        Cancelar edición
                    </button>
                )}

            </form>

            {/* Mensajes del sistema */}
            {mensaje && <p>{mensaje}</p>}

            {error && <p>{error}</p>}

            {/* Listado de videojuegos */}
            <section className="gestion-listado">

                <h2>Videojuegos registrados</h2>

                {cargando ? (
                    <p>Cargando videojuegos...</p>
                ) : (

                    <div className="grid-videojuegos">

                        {videojuegos.map(videojuego => (

                            <div className="card-videojuego" key={videojuego.id}>

                                {/* Imagen del videojuego */}
                                <img
                                    src={videojuego.imagenUrl}
                                    alt={videojuego.nombre}
                                />

                                <h3>{videojuego.nombre}</h3>

                                <p>{videojuego.plataforma}</p>

                                {/* Acciones de cada videojuego */}
                                <div className="acciones-videojuego">

                                    <button
                                        type="button"
                                        onClick={() => editarVideojuego(videojuego)}
                                    >
                                        Editar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => eliminarVideojuego(videojuego.id)}
                                    >
                                        Eliminar
                                    </button>

                                </div>

                            </div>

                        ))}

                        {videojuegos.length === 0 && (
                            <p>No hay videojuegos registrados.</p>
                        )}

                    </div>

                )}

            </section>

        </div>
    )
}

export default GestionItems
