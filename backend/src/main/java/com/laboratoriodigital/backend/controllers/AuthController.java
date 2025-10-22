package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.controllers.dto.RegisterRequest;
import com.laboratoriodigital.backend.repositories.MaestroRepository;
import com.laboratoriodigital.backend.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.laboratoriodigital.backend.controllers.dto.LoginRequest;
import com.laboratoriodigital.backend.controllers.dto.LoginResponse;
import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.services.JwtService;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.HashMap;
import java.util.Map;
import org.springframework.security.core.Authentication; // Para obtener info del usuario autenticado
import org.springframework.security.core.context.SecurityContextHolder; // Para acceder al contexto de seguridad
import com.laboratoriodigital.backend.models.Maestro; // Importa tu modelo Maestro

@RestController
@RequestMapping("/api/maestros")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarMaestro(@RequestBody RegisterRequest registerRequest){
        try{
            authService.registrarMaestro(
                    registerRequest.getNombre(),
                    registerRequest.getEmail(),
                    registerRequest.getPassword()
            );
            return new ResponseEntity<>(Map.of("message", "Usuario Registado Exitosamente"), HttpStatus.CREATED);

        } catch (Exception e){
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> autenticarMaestro(@RequestBody LoginRequest loginRequest){
        try{
            Maestro maestroAutenticado = authService.autenticarMaestro(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            );
            String jwtToken = jwtService.generateToken(maestroAutenticado);

            return  ResponseEntity.ok(new LoginResponse(jwtToken,"Inicio de sesión exitoso" ));
        } catch (BadCredentialsException e){
            return new ResponseEntity<>(Map.of("message", e.getMessage()), HttpStatus.UNAUTHORIZED);
        } catch (Exception e){
            return new ResponseEntity<>(Map.of("message", "Error en el servidor"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/perfil")
    public ResponseEntity<?> getMaestroPerfil(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || !authentication.isAuthenticated()|| !(authentication.getPrincipal() instanceof UserDetails)){
            return new ResponseEntity<>(Map.of("message", "No autorizado"), HttpStatus.UNAUTHORIZED);
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String email = userDetails.getUsername();

        try {
            Maestro maestro = maestroRepository.findByEmail(email)
                    .orElseThrow(() -> new Exception("Mestro no encontrado en BD"));

            Map<String, Object> perfilResponse = new HashMap<>();
            perfilResponse.put("id", maestro.getId());
            perfilResponse.put("nombre", maestro.getNombre());
            perfilResponse.put("email", maestro.getEmail());
            perfilResponse.put("createdAt", maestro.getCreatedAt());

            return ResponseEntity.ok(perfilResponse);
        }catch (Exception e){
            return new ResponseEntity<>(Map.of("message", "Error al buscar el perfil"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Autowired
    private MaestroRepository maestroRepository;

}
