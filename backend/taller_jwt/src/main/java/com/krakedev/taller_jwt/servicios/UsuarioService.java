
package com.krakedev.taller_jwt.servicios;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.krakedev.taller_jwt.entidades.Usuario;
import com.krakedev.taller_jwt.repositorios.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    // Inyeccion de dependencias por constructor
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Guardar usuario
    public Usuario guardar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Buscar usuario por username
    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    // Autenticar usuario
    public boolean autenticar(String username, String password) {

        Optional<Usuario> usuarioEncontrado =
                usuarioRepository.findByUsername(username);

        if (usuarioEncontrado.isPresent()) {
            Usuario usuario = usuarioEncontrado.get();

            return usuario.getPassword().equals(password);
        }

        return false;
    }
}
