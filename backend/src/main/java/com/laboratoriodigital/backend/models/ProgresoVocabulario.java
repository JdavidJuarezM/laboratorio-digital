package com.laboratoriodigital.backend.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progresos_vocabulario")
public class ProgresoVocabulario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maestro_id", nullable = false, unique = true)
    private Maestro maestro;

    @Column(name = "high_score", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer highScore = 0;

    @Column(name = "max_streak", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer maxStreak = 0;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public ProgresoVocabulario() {}

    public ProgresoVocabulario(Maestro maestro) {
        this.maestro = maestro;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Maestro getMaestro() { return maestro; }
    public void setMaestro(Maestro maestro) { this.maestro = maestro; }
    public Integer getHighScore() { return highScore; }
    public void setHighScore(Integer highScore) { this.highScore = highScore; }
    public Integer getMaxStreak() { return maxStreak; }
    public void setMaxStreak(Integer maxStreak) { this.maxStreak = maxStreak; }
}