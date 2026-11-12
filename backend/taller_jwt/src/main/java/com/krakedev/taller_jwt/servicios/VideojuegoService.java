
package com.krakedev.taller_jwt.servicios;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.krakedev.taller_jwt.entidades.Videojuego;
import com.krakedev.taller_jwt.repositorios.VideojuegoRepository;

@Service
public class VideojuegoService {

    private final VideojuegoRepository videojuegoRepository;

    // Inyectamos el repositorio mediante el constructor
    public VideojuegoService(VideojuegoRepository videojuegoRepository) {
        this.videojuegoRepository = videojuegoRepository;
    }

    // Guardar un videojuego
    public Videojuego guardar(Videojuego videojuego) {
        return videojuegoRepository.save(videojuego);
    }

    // Listar todos los videojuegos
    public List<Videojuego> listar() {
        return videojuegoRepository.findAll();
    }

    // Buscar un videojuego por su ID
    public Optional<Videojuego> buscarPorId(Integer id) {
        return videojuegoRepository.findById(id);
    }

    // Actualizar un videojuego
    public Videojuego actualizar(Videojuego videojuego) {
        return videojuegoRepository.save(videojuego);
    }

    // Eliminar un videojuego por su ID
    public boolean eliminar(Integer id) {

        if (videojuegoRepository.existsById(id)) {
            videojuegoRepository.deleteById(id);
            return true;
        }

        return false;
    }
}
