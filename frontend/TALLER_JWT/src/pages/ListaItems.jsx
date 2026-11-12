
import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config/apiConfig'
import { useAuth } from '../context/AuthContext'
import './ListaItems.css'

function ListaItems() {

    const { token } = useAuth()

    const [videojuegos, setVideojuegos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {

        let imagenesUrl = []

        const obtenerVideojuegos = async () => {

            try {
                const respuesta = await fetch(`${API_BASE_URL}/auth/items`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!respuesta.ok) {
                    throw new Error('Error al obtener los videojuegos')
                }

                const datos = await respuesta.json()

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

                    imagenesUrl.push(imagenUrl)

                    return {
                        ...videojuego,
                        imagenUrl
                    }
                })

                setVideojuegos(lista)

            } catch (error) {
                setError(error.message)
            } finally {
                setCargando(false)
            }
        }

        obtenerVideojuegos()

        // Liberar las URL al desmontar el componente
        return () => {
            imagenesUrl.forEach(url => URL.revokeObjectURL(url))
        }

    }, [token])

    if (cargando) {
        return <p>Cargando videojuegos...</p>
    }

    if (error) {
        return <p>{error}</p>
    }

    return (
        <div className="lista-items">

            <h1>Catálogo de videojuegos</h1>

            <div className="grid-videojuegos">

                {videojuegos.map(videojuego => (

                    <div className="card-videojuego" key={videojuego.id}>

                        <img
                            src={videojuego.imagenUrl}
                            alt={videojuego.nombre}
                        />

                        <h3>{videojuego.nombre}</h3>

                        <p>{videojuego.plataforma}</p>

                    </div>

                ))}

            </div>

        </div>
    )
}

export default ListaItems
