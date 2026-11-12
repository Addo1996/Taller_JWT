
package com.krakedev.taller_jwt.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.krakedev.taller_jwt.entidades.Videojuego;

@Repository
public interface VideojuegoRepository extends JpaRepository<Videojuego, Integer> {

}
