package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.controllers.dto.HighScoreResponse;
import com.laboratoriodigital.backend.controllers.dto.SaveScoreRequest;
import com.laboratoriodigital.backend.services.MaestroService;
import com.laboratoriodigital.backend.services.SupermercadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/supermercado")
public class SupermercadoController {

    @Autowired
    private SupermercadoService supermercadoService;

    @Autowired
    private MaestroService maestroService;

    @GetMapping("/highscore")
    public ResponseEntity<HighScoreResponse> getHighScore() {
        try {
            Long maestroId = maestroService.getCurrentMaestroId();
            Integer score = supermercadoService.getHighScore(maestroId);
            return ResponseEntity.ok(new HighScoreResponse(score));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/guardar")
    public ResponseEntity<?> saveHighScore(@RequestBody SaveScoreRequest request) {
        try {
            Long maestroId = maestroService.getCurrentMaestroId();
            supermercadoService.saveHighScore(maestroId, request.getScore());
            return ResponseEntity.ok(Map.of("message", "Puntuación guardada exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al guardar"));
        }
    }
}