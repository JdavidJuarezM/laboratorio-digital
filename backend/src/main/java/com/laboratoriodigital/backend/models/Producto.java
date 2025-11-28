package com.laboratoriodigital.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String emoji;
    private Double precio;
    private String categoria; // Ej: Frutas, Lacteos, etc.

    // Constructores, Getters y Setters
    public Producto() {}

    public Producto(String nombre, String emoji, Double precio, String categoria) {
        this.nombre = nombre;
        this.emoji = emoji;
        this.precio = precio;
        this.categoria = categoria;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEmoji() { return emoji; }
    public void setEmoji(String emoji) { this.emoji = emoji; }
    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
}