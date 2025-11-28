package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.models.Producto;
import com.laboratoriodigital.backend.repositories.ProductoRepository;
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
}