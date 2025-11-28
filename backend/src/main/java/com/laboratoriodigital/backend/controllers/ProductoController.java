package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.models.CategoriaProducto;
import com.laboratoriodigital.backend.models.Maestro;
import com.laboratoriodigital.backend.models.Producto;
import com.laboratoriodigital.backend.repositories.CategoriaProductoRepository;
import com.laboratoriodigital.backend.repositories.ProductoRepository;
import com.laboratoriodigital.backend.services.MaestroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaProductoRepository categoriaRepository;

    @Autowired
    private MaestroService maestroService;

    // --- PRODUCTOS ---

    @GetMapping
    public List<Producto> obtenerProductos() {
        return productoRepository.findAll();
    }

    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoRepository.save(producto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        productoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Producto eliminado"));
    }

    // --- NUEVO: CATEGORÍAS ---

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaProducto>> listarCategorias() {
        try {
            Maestro maestro = maestroService.getCurrentMaestro();
            return ResponseEntity.ok(categoriaRepository.findByMaestro(maestro));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/categorias")
    public ResponseEntity<?> crearCategoria(@RequestBody Map<String, String> body) {
        try {
            String nombre = body.get("nombre");
            if (nombre == null || nombre.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "El nombre es requerido"));
            }

            Maestro maestro = maestroService.getCurrentMaestro();
            // Evitar duplicados
            CategoriaProducto nueva = categoriaRepository.findByNombreAndMaestro(nombre, maestro)
                    .orElseGet(() -> categoriaRepository.save(new CategoriaProducto(nombre, maestro)));

            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al crear categoría"));
        }
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<?> eliminarCategoria(@PathVariable Long id) {
        try {
            categoriaRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Categoría eliminada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error al eliminar"));
        }
    }
}