// backend/src/main/java/com/laboratoriodigital/backend/controllers/VocabularioController.java
package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.models.Categoria;
import com.laboratoriodigital.backend.models.Palabra;
import com.laboratoriodigital.backend.models.ProgresoVocabulario;
import com.laboratoriodigital.backend.services.MaestroService;
import com.laboratoriodigital.backend.services.VocabularioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vocabulario")
public class VocabularioController {

    @Autowired
    private VocabularioService vocabularioService;

    @Autowired
    private MaestroService maestroService;

    // --- Endpoints de Progreso ---
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
            vocabularioService.saveScore(maestroId, request.get("score"), request.get("streak"));
            return ResponseEntity.ok(Map.of("message", "Progreso guardado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al guardar"));
        }
    }

    // --- Nuevos Endpoints de Gestión de Palabras ---
    @GetMapping("/palabras")
    public ResponseEntity<List<Palabra>> listarPalabras() {
        return ResponseEntity.ok(vocabularioService.obtenerPalabras());
    }

    @PostMapping("/palabras")
    public ResponseEntity<?> guardarPalabra(@RequestBody Palabra palabra) {
        try {
            Palabra nueva = vocabularioService.guardarPalabra(palabra);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al guardar palabra"));
        }
    }

    @DeleteMapping("/palabras/{id}")
    public ResponseEntity<?> eliminarPalabra(@PathVariable Long id) {
        vocabularioService.eliminarPalabra(id);
        return ResponseEntity.ok(Map.of("message", "Palabra eliminada"));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return ResponseEntity.ok(vocabularioService.obtenerCategorias());
    }

    @PostMapping("/categorias")
    public ResponseEntity<?> crearCategoria(@RequestBody Map<String, String> body) {
        try {
            String nombre = body.get("nombre");
            if (nombre == null || nombre.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "El nombre es requerido"));
            }
            Categoria nueva = vocabularioService.guardarCategoria(nombre.trim());
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al crear categoría"));
        }
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Long id) {
        vocabularioService.eliminarCategoria(id);
        return ResponseEntity.ok(Map.of("message", "Categoría eliminada"));
    }

}
