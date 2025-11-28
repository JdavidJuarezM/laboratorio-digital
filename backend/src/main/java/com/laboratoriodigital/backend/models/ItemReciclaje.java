package com.laboratoriodigital.backend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "items_reciclaje")
public class ItemReciclaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre; // Ej: "Botella Rota"

    @Column(nullable = false)
    private String tipo; // Ej: "glass", "plastic", "paper" (Debe coincidir con los IDs de los botes)

    @Column(nullable = false)
    private String icono; // Ej: "🍾" (Emoji)

    public ItemReciclaje() {}

    public ItemReciclaje(String nombre, String tipo, String icono) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.icono = icono;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getIcono() { return icono; }
    public void setIcono(String icono) { this.icono = icono; }
}