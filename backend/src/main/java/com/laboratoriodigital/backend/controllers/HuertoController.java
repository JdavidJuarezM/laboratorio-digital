package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.controllers.dto.ProgresoHuertoDTO;
import com.laboratoriodigital.backend.models.ProgresoHuerto; // Importa la entidad
import com.laboratoriodigital.backend.services.HuertoService;
import com.laboratoriodigital.backend.services.JwtService; // Necesario para obtener el ID del usuario
import io.jsonwebtoken.Claims; // Necesario para leer claims del token
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/huerto")
public class HuertoController {

    @Autowired
    private HuertoService huertoService;

    private Long getCurrentMaestroId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {

            String email = ((UserDetails) authentication.getPrincipal()).getUsername();

            var maestro = huertoService.findMaestroByEmail(email);
            if (maestro != null) return maestro.getId();
        }
        throw new RuntimeException("No se pudo obtener el ID del usuario autenticado.");

    }

    @GetMapping
    public ResponseEntity<ProgresoHuertoDTO> getHuertoState() {
        try {

            Long maestroId = getCurrentMaestroId();
            ProgresoHuerto progreso = huertoService.getEstadoHuertoDelUsuario(maestroId);

            ProgresoHuertoDTO dto = new ProgresoHuertoDTO(progreso.getEtapa(), progreso.getAgua(), progreso.getSol(), progreso.getRespuestasCorrectas());
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/actualizar")
    public ResponseEntity<?> updateHuertoState(@RequestBody ProgresoHuertoDTO estadoActualizadoDTO) {
        try {
            Long maestroId = getCurrentMaestroId();

            ProgresoHuerto estadoParaActualizar = new ProgresoHuerto();
            estadoParaActualizar.setEtapa(estadoActualizadoDTO.getEtapa());
            estadoParaActualizar.setAgua(estadoActualizadoDTO.getAgua());
            estadoParaActualizar.setSol(estadoActualizadoDTO.getSol());
            estadoParaActualizar.setRespuestasCorrectas(estadoActualizadoDTO.getRespuestasCorrectas());

            huertoService.actualizarEstadoHuerto(maestroId, estadoParaActualizar);
            return ResponseEntity.ok(Map.of("message", "Estado del huerto actualizado correctamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }
}
