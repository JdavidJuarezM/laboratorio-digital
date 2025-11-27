package com.laboratoriodigital.backend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progresos_supermercado")
public class ProgresoSupermercado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el Maestro (Usuario)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maestro_id", nullable = false, unique = true)
    private Maestro maestro;

    @Column(name = "high_score", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer highScore = 0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    @PrePersist
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public ProgresoSupermercado() {}

    public ProgresoSupermercado(Maestro maestro) {
        this.maestro = maestro;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Maestro getMaestro() { return maestro; }
    public void setMaestro(Maestro maestro) { this.maestro = maestro; }
    public Integer getHighScore() { return highScore; }
    public void setHighScore(Integer highScore) { this.highScore = highScore; }
}