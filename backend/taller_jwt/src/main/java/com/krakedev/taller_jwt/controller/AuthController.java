
package com.krakedev.taller_jwt.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.krakedev.taller_jwt.entidades.Usuario;
import com.krakedev.taller_jwt.repositorios.UsuarioRepository;
import com.krakedev.taller_jwt.servicios.TokenBlackListService;
import com.krakedev.taller_jwt.servicios.UsuarioService;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.krakedev.taller_jwt.JwtUtil;

@RestController
@RequestMapping("/auth")
public class AuthController {

	private final UsuarioService usuarioservice;
	private final UsuarioRepository usuariorepostitory;
	private final TokenBlackListService blacklistservice;

	// Inyeccion de dependencias por constructor
	public AuthController(UsuarioService usuarioservice, UsuarioRepository usuariorepostitory,
			TokenBlackListService blacklistservice) {

		this.usuarioservice = usuarioservice;
		this.usuariorepostitory = usuariorepostitory;
		this.blacklistservice = blacklistservice;
	}

	// Registrar un usuario
	@PostMapping("/registrar")
	public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {

		try {
			Usuario usuarioNuevo = usuarioservice.guardar(usuario);

			return ResponseEntity.status(HttpStatus.CREATED).body(usuarioNuevo);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error al registrar usuario: " + e.getMessage());
		}
	}

	// Iniciar sesion y generar el token
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {

		String username = credenciales.get("username");
		String password = credenciales.get("password");

		// Validar las credenciales
		boolean autenticado = usuarioservice.autenticar(username, password);

		if (autenticado) {

			// Buscar el usuario en el repositorio
			Usuario usuario = usuariorepostitory.findByUsername(username).get();

			String token = JwtUtil.generarToken(usuario.getUsername(), usuario.getRol());

			return ResponseEntity.ok(Map.of("token", token));

		} else {

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contrasena incorrectos");
		}
	}

	@GetMapping("/perfil")
	public ResponseEntity<?> verPerfil(){

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		
		String Usuario = auth.getName();
		
		String Rol = auth.getAuthorities().iterator().next().getAuthority();
		
		return ResponseEntity.ok(Map.of("Mensaje", "Bienvenido al Sistema protegido por Spring Security",
				"Usuario", Usuario, "rol_Detectado", Rol, "Status", "Autenticado Exitosamente"));
	}

	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {

		if (authHeader != null && authHeader.startsWith("Bearer ")) {

			String token = authHeader.substring(7);

			blacklistservice.invalidarToken(token);
			return ResponseEntity.ok(Map.of("Mensaje : ", "Secion Cerrada Exitosamente. Token Invalidado "));

		} else {

			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token no proporcionado");

		}

	}
	
	@GetMapping("/dashboard")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> adminDashboard(){
		
		String Usuario = SecurityContextHolder.getContext().getAuthentication().getName();
		
		return ResponseEntity.ok(Map.of("Mensaje", "Bienvenido al panel secreto de Administradores"));
		
	}
}
