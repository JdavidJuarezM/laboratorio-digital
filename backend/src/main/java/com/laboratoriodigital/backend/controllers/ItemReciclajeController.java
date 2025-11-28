package com.laboratoriodigital.backend.controllers;

import com.laboratoriodigital.backend.models.ItemReciclaje;
import com.laboratoriodigital.backend.repositories.ItemReciclajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reciclaje/items")
public class ItemReciclajeController {

    @Autowired
    private ItemReciclajeRepository repository;

    @GetMapping
    public List<ItemReciclaje> obtenerItems() {
        return repository.findAll();
    }

    @PostMapping
    public ItemReciclaje crearItem(@RequestBody ItemReciclaje item) {
        return repository.save(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarItem(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Item eliminado"));
    }
}