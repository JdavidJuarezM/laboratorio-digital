// backend/src/main/java/com/laboratoriodigital/backend/controllers/ReciclajeController.java
package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.controllers.dto.HighScoreResponse;
import com.laboratoriodigital.backend.controllers.dto.SaveScoreRequest;
import com.laboratoriodigital.backend.services.MaestroService;
import com.laboratoriodigital.backend.services.ReciclajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reciclaje")
public class ReciclajeController {

    @Autowired
    private ReciclajeService reciclajeService;

    @Autowired
    private MaestroService maestroService;


    @GetMapping("/highscore")
    public ResponseEntity<HighScoreResponse> getHighScore() {
        try {
            Long maestroId = maestroService.getCurrentMaestroId();
            Integer highScore = reciclajeService.getHighScore(maestroId);
            return ResponseEntity.ok(new HighScoreResponse(highScore));
        } catch (RuntimeException e) {

            return ResponseEntity.status(401).build();
        }
    }


    @PostMapping("/guardar")
    public ResponseEntity<?> saveHighScore(@RequestBody SaveScoreRequest request) {
        try {
            Long maestroId = maestroService.getCurrentMaestroId();
            reciclajeService.saveHighScore(maestroId, request.getScore());
            return ResponseEntity.ok(Map.of("message", "Puntuación guardada exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).build();
        }
    }
}
