// backend/src/main/java/com/laboratoriodigital/backend/controllers/dto/SaveScoreRequest.java
package com.laboratoriodigital.backend.controllers.dto;

// Este DTO se usa para recibir el JSON del frontend
// Ejemplo de JSON: { "score": 1500 }
public class SaveScoreRequest {
    private Integer score;

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}