package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.services.MaestroService;
import com.laboratoriodigital.backend.services.VocabularioService;
import com.laboratoriodigital.backend.models.ProgresoVocabulario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/vocabulario")
public class VocabularioController {

    @Autowired
    private VocabularioService vocabularioService;

    @Autowired
    private MaestroService maestroService;

    @GetMapping("/highscore")
    public ResponseEntity<?> getHighScore() {
        try {
            Long maestroId = maestroService.getCurrentMaestroId();
            ProgresoVocabulario progreso = vocabularioService.getProgreso(maestroId);
            return ResponseEntity.ok(Map.of(
                "highScore", progreso.getHighScore(),
                "streak", progreso.getMaxStreak()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/guardar")
    public ResponseEntity<?> saveScore(@RequestBody Map<String, Integer> request) {
        try {
            Long maestroId = maestroService.getCurrentMaestroId();
            Integer score = request.get("score");
            Integer streak = request.get("streak");

            vocabularioService.saveScore(maestroId, score, streak);
            return ResponseEntity.ok(Map.of("message", "Progreso guardado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al guardar"));
        }
    }
}