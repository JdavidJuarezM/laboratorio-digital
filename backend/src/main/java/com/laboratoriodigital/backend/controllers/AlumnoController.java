package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.models.Alumno;
import com.laboratoriodigital.backend.services.AlumnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alumnos")
public class AlumnoController {

    @Autowired
    private AlumnoService alumnoService;

    @GetMapping
    public ResponseEntity<List<Alumno>> listarAlumnos() {
        return ResponseEntity.ok(alumnoService.obtenerAlumnosDelMaestro());
    }

    @PostMapping
    public ResponseEntity<Alumno> crearAlumno(@RequestBody Map<String, String> payload) {
        String nombre = payload.get("nombre");
        return ResponseEntity.ok(alumnoService.crearAlumno(nombre));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAlumno(@PathVariable Long id) {
        alumnoService.eliminarAlumno(id);
        return ResponseEntity.ok(Map.of("message", "Alumno eliminado"));
    }

    @PutMapping("/{id}/progreso")
    public ResponseEntity<?> actualizarProgreso(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        Integer etapa = payload.get("etapa");
        Integer aciertos = payload.get("aciertos");
        alumnoService.actualizarProgreso(id, etapa, aciertos);
        return ResponseEntity.ok(Map.of("message", "Progreso guardado"));
    }
}