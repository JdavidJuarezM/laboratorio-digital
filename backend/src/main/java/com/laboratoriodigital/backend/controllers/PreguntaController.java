package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.services.PreguntaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/preguntas")
public class PreguntaController {

    @Autowired
    private PreguntaService preguntaService;

    @GetMapping
    public ResponseEntity<?> getPreguntas() {
        return ResponseEntity.ok(preguntaService.obtenerPreguntasEstructuradas());
    }

    @PostMapping("/guardar-todo")
    public ResponseEntity<?> guardarTodo(@RequestBody Map<String, List<PreguntaService.PreguntaDTO>> payload) {
        try {
            preguntaService.guardarTodo(payload);
            return ResponseEntity.ok(Map.of("message", "Preguntas actualizadas correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al guardar: " + e.getMessage()));
        }
    }
}