package com.laboratoriodigital.backend.models;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "alumnos")
public class Alumno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer etapa = 0;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer aciertos = 0;

    // Relación: Muchos alumnos pertenecen a Un Maestro
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maestro_id", nullable = false)
    @JsonIgnore // Evita bucles infinitos al convertir a JSON
    private Maestro maestro;

    public Alumno() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getEtapa() { return etapa; }
    public void setEtapa(Integer etapa) { this.etapa = etapa; }

    public Integer getAciertos() { return aciertos; }
    public void setAciertos(Integer aciertos) { this.aciertos = aciertos; }

    public Maestro getMaestro() { return maestro; }
    public void setMaestro(Maestro maestro) { this.maestro = maestro; }
}