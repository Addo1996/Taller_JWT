
package com.krakedev.taller_jwt.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.krakedev.taller_jwt.JwtUtil;
import com.krakedev.taller_jwt.servicios.TokenBlackListService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	// Servicio que verifica si el token fue invalidado al cerrar sesion
	private final TokenBlackListService blacklistservice;

	// Constructor para inyectar el servicio de lista negra
	public JwtAuthenticationFilter(TokenBlackListService blacklistservice) {
		super();
		this.blacklistservice = blacklistservice;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		// Obtener el token enviado en la cabecera Authorization
		String authHeder = request.getHeader("Authorization");

		// Comprobar si existe la cabecera y si contiene el prefijo Bearer
		if (authHeder == null || !authHeder.startsWith("Bearer ")) {

			// Continuar con la cadena de filtros si no hay token
			filterChain.doFilter(request, response);
			return;
		}

		// Extraer el token eliminando el prefijo Bearer
		String token = authHeder.substring(7);

		// Verificar si el token se encuentra invalidado
		if (blacklistservice.estaInvalidado(token)) {

			// Denegar el acceso si la sesion fue cerrada
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().write("Acceso Denegado : Secion Cerrada ");
			return;
		}

		// Validar el token y obtener sus datos
		DecodedJWT datosToken = JwtUtil.validarToken(token);

		if (datosToken != null) {

			// Obtener el nombre de usuario y el rol almacenados en el token
			String username = datosToken.getSubject();
			String rolOriginal = datosToken.getClaim("rol").asString();

			// Agregar el prefijo que utiliza Spring Security para los roles
			String rolSpring = "ROLE_" + rolOriginal;

			// Crear la autoridad correspondiente al rol del usuario
			SimpleGrantedAuthority authority = new SimpleGrantedAuthority(rolSpring);

			// Crear el objeto de autenticacion con el usuario y su autoridad
			UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, null,
					Collections.singleton(authority));

			// Registrar la autenticacion en el contexto de seguridad
			SecurityContextHolder.getContext().setAuthentication(authentication);
		}

		// Continuar con los siguientes filtros de seguridad
		filterChain.doFilter(request, response);
	}

}
