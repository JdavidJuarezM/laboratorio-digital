package com.laboratoriodigital.backend.models;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "progresos_huertos")
public class ProgresoHuerto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maestro_id", nullable = false, unique = true)
    private Maestro maestro;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer etapa = 0;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 50")
    private Integer agua = 50;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 50")
    private Integer sol = 50;

    @Column(name = "Respuestas_correctas",nullable = false,columnDefinition = "INT DEFAULT 0")
    private Integer respuestasCorrectas = 0;

    @Column (name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name= "updated_at")
    private LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public ProgresoHuerto(){

    }

    public ProgresoHuerto(Maestro maestro) {
        this.maestro = maestro;
    }

    public long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Maestro getMaestro() {
        return maestro;
    }

    public void setMaestro(Maestro maestro) {
        this.maestro = maestro;
    }

    public Integer getEtapa() {
        return etapa;
    }

    public void setEtapa(Integer etapa) {
        this.etapa = etapa;
    }

    public Integer getAgua() {
        return agua;
    }

    public void setAgua(Integer agua) {
        this.agua = agua;
    }

    public Integer getSol() {
        return sol;
    }

    public void setSol(Integer sol) {
        this.sol = sol;
    }

    public Integer getRespuestasCorrectas() {
        return respuestasCorrectas;
    }

    public void setRespuestasCorrectas(Integer respuestasCorrectas) {
        this.respuestasCorrectas = respuestasCorrectas;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
