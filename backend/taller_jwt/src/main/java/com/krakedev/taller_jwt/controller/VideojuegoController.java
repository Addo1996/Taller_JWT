
package com.krakedev.taller_jwt.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.krakedev.taller_jwt.entidades.Videojuego;
import com.krakedev.taller_jwt.servicios.VideojuegoService;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/auth/items")
public class VideojuegoController {

    private final VideojuegoService videojuegoService;

    // Inyectamos el servicio mediante el constructor
    public VideojuegoController(VideojuegoService videojuegoService) {
        this.videojuegoService = videojuegoService;
    }

    // Listar todos los videojuegos
    @GetMapping
    public ResponseEntity<List<Videojuego>> listar() {
        try {
            List<Videojuego> videojuegos = videojuegoService.listar();
            return ResponseEntity.ok(videojuegos);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    

    // Registrar un videojuego con su imagen
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<Videojuego> guardar(
            @RequestParam("nombre") String nombre,
            @RequestParam("plataforma") String plataforma,
            @RequestParam("foto") MultipartFile foto) {

        try {
            Videojuego videojuego = new Videojuego();

            videojuego.setNombre(nombre);
            videojuego.setPlataforma(plataforma);
            videojuego.setMimeType(foto.getContentType());
            videojuego.setFoto(foto.getBytes());

            Videojuego videojuegoNuevo = videojuegoService.guardar(videojuego);

            return ResponseEntity.status(HttpStatus.CREATED).body(videojuegoNuevo);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
 // Actualizar un videojuego por su ID
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<Videojuego> actualizar(
            @PathVariable Integer id,
            @RequestParam("nombre") String nombre,
            @RequestParam("plataforma") String plataforma,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {

        try {
            Videojuego videojuego = videojuegoService.buscarPorId(id).orElse(null);

            if (videojuego == null) {
                return ResponseEntity.notFound().build();
            }

            videojuego.setNombre(nombre);
            videojuego.setPlataforma(plataforma);

            // Actualizamos la imagen solamente si se envía una nueva
            if (foto != null && !foto.isEmpty()) {
                videojuego.setMimeType(foto.getContentType());
                videojuego.setFoto(foto.getBytes());
            }

            Videojuego videojuegoActualizado = videojuegoService.actualizar(videojuego);

            return ResponseEntity.ok(videojuegoActualizado);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    

    // Eliminar un videojuego por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        try {
            boolean eliminado = videojuegoService.eliminar(id);

            if (eliminado) {
                return ResponseEntity.ok().build();
            }

            return ResponseEntity.notFound().build();

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }



    
}
