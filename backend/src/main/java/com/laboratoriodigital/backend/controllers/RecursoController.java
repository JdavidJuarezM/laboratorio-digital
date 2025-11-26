package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.models.Recurso;
import com.laboratoriodigital.backend.services.RecursoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recursos")
public class RecursoController {

    @Autowired
    private RecursoService recursoService;

    @Autowired
    private com.laboratoriodigital.backend.repositories.RecursoRepository recursoRepository;

    @GetMapping("/{categoria}")
    public ResponseEntity<List<Recurso>> getRecursos(@PathVariable String categoria) {
        return ResponseEntity.ok(recursoService.obtenerPorCategoria(categoria));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadRecurso(
            @RequestParam("titulo") String titulo,
            @RequestParam("categoria") String categoria,
            @RequestParam("file") MultipartFile file) {

        try {
            Recurso recurso = recursoService.guardarRecurso(titulo, categoria, file);
            return ResponseEntity.ok(Map.of("message", "Recurso subido exitosamente", "id", recurso.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al subir: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecurso(@PathVariable Long id) {
        recursoService.eliminarRecurso(id);
        return ResponseEntity.ok(Map.of("message", "Recurso eliminado"));
    }

    // --- MÉTODO ACTUALIZADO PARA VISUALIZAR ---
    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        try {
            Path filePath = recursoService.loadFileAsResource(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                // 1. Intentar determinar el tipo de archivo (PDF, Imagen, etc.)
                String contentType = null;
                try {
                    contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
                } catch (IOException ex) {
                    // Ignorar error si no se puede determinar
                }

                // Si no se determina, usar el genérico (esto causaría descarga, pero es el fallback)
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        // 2. Esta cabecera "inline" es la clave para que se vea en el navegador
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/link")
    public ResponseEntity<?> crearEnlace(
            @RequestBody Map<String, String> payload) {

        try {
            String titulo = payload.get("titulo");
            String categoria = payload.get("categoria");
            String url = payload.get("url");

            if (titulo == null || categoria == null || url == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Faltan datos requeridos"));
            }

            Recurso recurso = new Recurso();
            recurso.setTitulo(titulo);
            recurso.setCategoria(categoria);
            recurso.setUrl(url); // Guardamos la URL directa
            recurso.setTipoArchivo("link"); // Marcador especial para el frontend

            Recurso nuevoRecurso = recursoRepository.save(recurso);

            return ResponseEntity.ok(Map.of("message", "Enlace guardado exitosamente", "id", nuevoRecurso.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al guardar enlace: " + e.getMessage()));
        }
    }
}